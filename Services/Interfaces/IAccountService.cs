using mcd_care_web.Models;
using mcd_care_web.Models.Accounts;

namespace mcd_care_web.Services.Interfaces;

public interface IAccountService
{
    Task<AuthenticateResponse> Authenticate(AuthenticateRequest model, string ipAddress);
    Task<AuthenticateResponse> RefreshToken(string token, string ipAddress);
    Task RevokeToken(string token, string ipAddress);
    Task Register(RegisterRequest model, string origin);
    Task VerifyEmail(string token);
    Task<AccountResponse> UpdateUser(Guid id, UpdateRequest model);
    Task<bool> UpdateUserRole(UpdateUserRoleRequest request);
    Task ForgotPassword(ForgotPasswordRequest model, string origin);
    Task ValidateResetToken(ValidateResetTokenRequest model);
    Task ResetPassword(ResetPasswordRequest model);
    Task<IEnumerable<AccountResponse>> GetAll();
    Task<AccountResponse> GetById(Guid id);
    Task<AccountResponse> Create(CreateRequest model);
    Task Delete(Guid id);
}
