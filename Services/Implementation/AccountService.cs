using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using mcd_care_web.Authorization;
using mcd_care_web.Entities;
using mcd_care_web.Entities.Context;
using mcd_care_web.Helpers;
using mcd_care_web.Models;
using mcd_care_web.Models.Accounts;
using mcd_care_web.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace mcd_care_web.Services.Implementation;

public class AccountService : IAccountService
{
    private readonly AppDataContext _context;
    private readonly IJwtUtils _jwtUtils;
    private readonly IMapper _mapper;
    private readonly AppSettings _appSettings;
    private readonly IEmailService _emailService;

    public AccountService(
        AppDataContext context,
        IJwtUtils jwtUtils,
        IMapper mapper,
        IOptions<AppSettings> appSettings,
        IEmailService emailService)
    {
        _context = context;
        _jwtUtils = jwtUtils;
        _mapper = mapper;
        _appSettings = appSettings.Value;
        _emailService = emailService;
    }

    public async Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, string ipAddress)
    {
        var account = _context.Users.SingleOrDefault(x => x.Email == model.Email);

        // validate
        if (account == null || !account.IsVerified || !BCrypt.Net.BCrypt.Verify(model.Password, account.PasswordHash))
            throw new ApiExceptions("Email or password is incorrect");

        // authentication successful so generate jwt and refresh tokens
        var jwtToken = _jwtUtils.GenerateJwtToken(account);
        var refreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
        account.RefreshTokens!.Add(refreshToken);

        // remove old refresh tokens from account
        removeOldRefreshTokens(account);

        // save changes to db
        _context.Update(account);
        _context.SaveChanges();

        var response = _mapper.Map<AuthenticateResponse>(account);
        response.JwtToken = jwtToken;
        response.RefreshToken = refreshToken.Token;
        return response;
    }

    public async Task<AuthenticateResponse> RefreshToken(string token, string ipAddress)
    {
        var account = getAccountByRefreshToken(token);
        var refreshToken = account.RefreshTokens!.Single(x => x.Token == token);

        if (refreshToken.IsRevoked)
        {
            // revoke all descendant tokens in case this token has been compromised
            revokeDescendantRefreshTokens(refreshToken, account, ipAddress,
                $"Attempted reuse of revoked ancestor token: {token}");
            _context.Update(account);
            _context.SaveChanges();
        }

        if (!refreshToken.IsActive)
            throw new ApiExceptions("Invalid token");

        // replace old refresh token with a new one (rotate token)
        var newRefreshToken = rotateRefreshToken(refreshToken, ipAddress);
        account.RefreshTokens.Add(newRefreshToken);


        // remove old refresh tokens from account
        removeOldRefreshTokens(account);

        // save changes to db
        _context.Update(account);
        _context.SaveChanges();

        // generate new jwt
        var jwtToken = _jwtUtils.GenerateJwtToken(account);

        // return data in authenticate response object
        var response = _mapper.Map<AuthenticateResponse>(account);
        response.JwtToken = jwtToken;
        response.RefreshToken = newRefreshToken.Token;
        return response;
    }

    public async Task RevokeToken(string token, string ipAddress)
    {
        var account = getAccountByRefreshToken(token);
        var refreshToken = account.RefreshTokens.Single(x => x.Token == token);

        if (!refreshToken.IsActive)
            throw new ApiExceptions("Invalid token");

        // revoke token and save
        revokeRefreshToken(refreshToken, ipAddress, "Revoked without replacement");
        _context.Update(account);
        _context.SaveChanges();
    }

    public async Task Register(RegisterRequest model, string origin)
    {
        try
        {
            // validate
            if (_context.Users.Any(x => x.Email == model.Email))
            {
                // send already registered error in email to prevent account enumeration
                await sendAlreadyRegisteredEmail(model.Email, origin);
                return;
            }

            // map model to new account object
            var account = _mapper.Map<User>(model);

            // first registered account is an admin
            var isFirstAccount = _context.Users.Count() == 0;
            account.Role = isFirstAccount ? Role.Admin : Role.User;
            account.Created = DateTime.UtcNow;
            account.VerificationToken = generateVerificationToken();

            // hash password
            account.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

            // save account
            _context.Users.Add(account);
            await _context.SaveChangesAsync();

            // send email
            await sendVerificationEmail(account, origin);

        }
        catch (Exception e)
        {
            throw new ApiExceptions(e.Message);
        }
    }

    public async Task VerifyEmail(string token)
    {
        var account = _context.Users.SingleOrDefault(x => x.VerificationToken == token);

        if (account == null)
            throw new ApiExceptions("Verification failed");

        account.Verified = DateTime.UtcNow;
        account.VerificationToken = null;

        _context.Users.Update(account);
        _context.SaveChanges();
    }

    public async Task<AccountResponse> UpdateUser(Guid id, UpdateRequest model)
    {
        var account = getAccount(id);

        // validate
        if (account.Email != model.Email && _context.Users.Any(x => x.Email == model.Email))
            throw new ApiExceptions($"Email '{model.Email}' is already registered");

        // hash password if it was entered
        if (!string.IsNullOrEmpty(model.Password))
            account.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

        // copy model to account and save
        _mapper.Map(model, account);
        account.Updated = DateTime.UtcNow;
        _context.Users.Update(account);
        await _context.SaveChangesAsync();

        return _mapper.Map<AccountResponse>(account);
    }

    public async Task<bool> UpdateUserRole(UpdateUserRoleRequest request)
    {
        try
        {
            var user =  getAccount(request.UserId);
            if (user == null)
            {
                throw new ApiExceptions($"User with Id '{request.UserId}' was not found");
            }

            var role = request.Role switch
            {
                "Admin" => Role.Admin,
                "User" => Role.User,
                _ => throw new ApiExceptions($"Role note available")
            };

            user.Role = role;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return true;
        }
        catch (Exception e)
        {
            throw new ApiExceptions(e.Message);
        }

    }

    public async Task ForgotPassword(ForgotPasswordRequest model, string origin)
    {
        var account = _context.Users.SingleOrDefault(x => x.Email == model.Email);

        // always return ok response to prevent email enumeration
        if (account == null) return;

        // create reset token that expires after 1 day
        account.ResetToken = generateResetToken();
        account.ResetTokenExpires = DateTime.UtcNow.AddDays(1);

        _context.Users.Update(account);
        _context.SaveChanges();

        // send email
        await sendPasswordResetEmail(account, origin);
    }

    public async Task ValidateResetToken(ValidateResetTokenRequest model)
    {
        getAccountByResetToken(model.Token);
    }

    public async Task ResetPassword(ResetPasswordRequest model)
    {
        var account = getAccountByResetToken(model.Token);

        // update password and remove reset token
        account.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
        account.PasswordReset = DateTime.UtcNow;
        account.ResetToken = null;
        account.ResetTokenExpires = null;

        _context.Users.Update(account);
        _context.SaveChanges();
    }

    public async Task<IEnumerable<AccountResponse>> GetAll()
    {
        var accounts = _context.Users
            .AsNoTracking()
            .ProjectTo<AccountResponse>(_mapper.ConfigurationProvider);
        return accounts;
    }

    public async Task<AccountResponse> GetById(Guid id)
    {
        var account = getAccount(id);
        return _mapper.Map<AccountResponse>(account);
    }

    public async Task<AccountResponse> Create(CreateRequest model)
    {
        // validate
        if (_context.Users.Any(x => x.Email == model.Email))
            throw new ApiExceptions($"Email '{model.Email}' is already registered");

        // map model to new account object
        var account = _mapper.Map<User>(model);
        account.Created = DateTime.UtcNow;
        account.Verified = DateTime.UtcNow;

        // hash password
        account.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

        // save account
        _context.Users.Add(account);
        _context.SaveChanges();

        return _mapper.Map<AccountResponse>(account);
    }

    public async Task Delete(Guid id)
    {
        var account = getAccount(id);
        _context.Users.Remove(account);
        _context.SaveChanges();
    }

    // helper methods

    private User getAccount(Guid id)
    {
        var account = _context.Users.Find(id);
        if (account == null) throw new KeyNotFoundException("Account not found");
        return account;
    }

    private User getAccountByRefreshToken(string token)
    {
        var account = _context.Users.SingleOrDefault(u => u.RefreshTokens!.Any(t => t.Token == token));
        if (account == null) throw new ApiExceptions("Invalid token");
        return account;
    }

    private User getAccountByResetToken(string token)
    {
        var account = _context.Users.SingleOrDefault(x =>
            x.ResetToken == token && x.ResetTokenExpires > DateTime.UtcNow);
        if (account == null) throw new ApiExceptions("Invalid token");
        return account;
    }

    private string generateJwtToken(User account)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("id", account.Id.ToString()) }),
            Expires = DateTime.UtcNow.AddMinutes(15),
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private string generateResetToken()
    {
        // token is a cryptographically strong random sequence of values
        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));

        // ensure token is unique by checking against db
        var tokenIsUnique = !_context.Users.Any(x => x.ResetToken == token);
        if (!tokenIsUnique)
            return generateResetToken();

        return token;
    }

    private string generateVerificationToken()
    {
        // token is a cryptographically strong random sequence of values
        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));

        // ensure token is unique by checking against db
        var tokenIsUnique = !_context.Users.Any(x => x.VerificationToken == token);
        if (!tokenIsUnique)
            return generateVerificationToken();

        return token;
    }

    private RefreshToken rotateRefreshToken(RefreshToken refreshToken, string ipAddress)
    {
        var newRefreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
        revokeRefreshToken(refreshToken, ipAddress, "Replaced by new token", newRefreshToken.Token);
        return newRefreshToken;
    }

    private void removeOldRefreshTokens(User account)
    {
        account.RefreshTokens!.RemoveAll(x =>
            !x.IsActive &&
            x.Created.AddDays(_appSettings.RefreshTokenTTL) <= DateTime.UtcNow);
    }

    private void revokeDescendantRefreshTokens(RefreshToken refreshToken, User account, string ipAddress, string reason)
    {
        // recursively traverse the refresh token chain and ensure all descendants are revoked
        if (!string.IsNullOrEmpty(refreshToken.ReplacedByToken))
        {
            var childToken = account.RefreshTokens!.SingleOrDefault(x => x.Token == refreshToken.ReplacedByToken);
            if (childToken!.IsActive)
                revokeRefreshToken(childToken, ipAddress, reason);
            else
                revokeDescendantRefreshTokens(childToken, account, ipAddress, reason);
        }
    }

    private void revokeRefreshToken(RefreshToken token, string ipAddress, string reason = null,
        string replacedByToken = null)
    {
        token.Revoked = DateTime.UtcNow;
        token.RevokedByIp = ipAddress;
        token.ReasonRevoked = reason;
        token.ReplacedByToken = replacedByToken;
    }

    private async Task sendVerificationEmail(User account, string origin)
    {
        string message;
        if (!string.IsNullOrEmpty(origin))
        {
            // origin exists if request sent from browser single page app (e.g. Angular or React)
            // so send link to verify via single page app
            var verifyUrl = $"{origin}/account/verify-email?token={account.VerificationToken}";
            message = $@"<p>Please click the below link to verify your email address:</p>
                            <p><a href=""{verifyUrl}"">{verifyUrl}</a></p>";
        }
        else
        {
            // origin missing if request sent directly to api (e.g. from Postman)
            // so send instructions to verify directly with api
            message =
                $@"<p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
                            <p><code>{account.VerificationToken}</code></p>";
        }

        await _emailService.Send(
            to: account.Email,
            subject: "Sign-up Verification API - Verify Email",
            html: $@"<h4>Verify Email</h4>
                        <p>Thanks for registering!</p>
                        {message}"
        );
    }

    private async Task sendAlreadyRegisteredEmail(string email, string origin)
    {
        string message;
        if (!string.IsNullOrEmpty(origin))
            message =
                $@"<p>If you don't know your password please visit the <a href=""{origin}/account/forgot-password"">forgot password</a> page.</p>";
        else
            message =
                "<p>If you don't know your password you can reset it via the <code>/accounts/forgot-password</code> api route.</p>";

        await _emailService.Send(
            to: email,
            subject: "Sign-up Verification API - Email Already Registered",
            html: $@"<h4>Email Already Registered</h4>
                        <p>Your email <strong>{email}</strong> is already registered.</p>
                        {message}"
        );
    }

    private async Task sendPasswordResetEmail(User account, string origin)
    {
        string message;
        if (!string.IsNullOrEmpty(origin))
        {
            var resetUrl = $"{origin}/account/reset-password?token={account.ResetToken}";
            message = $@"<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                            <p><a href=""{resetUrl}"">{resetUrl}</a></p>";
        }
        else
        {
            message =
                $@"<p>Please use the below token to reset your password with the <code>/accounts/reset-password</code> api route:</p>
                            <p><code>{account.ResetToken}</code></p>";
        }

        await _emailService.Send(
            to: account.Email,
            subject: "Sign-up Verification API - Reset Password",
            html: $@"<h4>Reset Password Email</h4>
                        {message}"
        );
    }
}
