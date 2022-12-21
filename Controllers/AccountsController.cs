using mcd_care_web.Authorization;
using mcd_care_web.Entities;
using mcd_care_web.Models;
using mcd_care_web.Models.Accounts;
using mcd_care_web.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace mcd_care_web.Controllers;

[Authorize]
[ApiController]
[Route("[controller]")]
public class AccountsController : BaseController
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<ActionResult<AuthenticateResponse>> Authenticate(AuthenticateRequest model)
    {
        try
        {
            var response = await _accountService.Authenticate(model, ipAddress());
            setTokenCookie(response.RefreshToken);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public async Task<ActionResult<AuthenticateResponse>> RefreshToken()
    {
        try
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var response = await _accountService.RefreshToken(refreshToken!, ipAddress());
            setTokenCookie(response.RefreshToken);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken(RevokeTokenRequest model)
    {
        try
        {
            // accept token from request body or cookie
            var token = model.Token ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required" });

            // users can revoke their own tokens and admins can revoke any tokens
            if (!Account.OwnsToken(token) && Account.Role != Role.Admin)
                return Unauthorized(new { message = "Unauthorized" });

            await _accountService.RevokeToken(token, ipAddress());
            return Ok(new { message = "Token revoked" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest model)
    {
        try
        {
            await _accountService.Register(model, Request.Headers["origin"]!);
            return Ok(new
                { message = "Registration successful, please check your email for verification instructions" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Role.Admin)]
    [HttpPut("update-user-role")]
    public async Task<IActionResult> UpdateUserRole(UpdateUserRoleRequest request)
    {
        try
        {
            var result = await _accountService.UpdateUserRole(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(VerifyEmailRequest model)
    {
        try
        {
            await _accountService.VerifyEmail(model.Token);
            return Ok(new { message = "Verification successful, you can now login" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest model)
    {
        try
        {
            await _accountService.ForgotPassword(model, Request.Headers["origin"]);
            return Ok(new { message = "Please check your email for password reset instructions" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("validate-reset-token")]
    public async Task<IActionResult> ValidateResetToken(ValidateResetTokenRequest model)
    {
        try
        {
            await _accountService.ValidateResetToken(model);
            return Ok(new { message = "Token is valid" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest model)
    {
        try
        {
            await _accountService.ResetPassword(model);
            return Ok(new { message = "Password reset successful, you can now login" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Role.Admin)]
    [HttpGet("get-all-users")]
    public async Task<ActionResult<IEnumerable<AccountResponse>>> GetAll()
    {
        try
        {
            var accounts = await _accountService.GetAll();
            return Ok(accounts);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("get-user-by-id/{id:Guid}")]
    public async Task<ActionResult<AccountResponse>> GetById(Guid id)
    {
        try
        {
            // users can get their own account and admins can get any account
            if (id != Account.Id && Account.Role != Role.Admin)
                return Unauthorized(new { message = "Unauthorized" });

            var account = await _accountService.GetById(id);
            return Ok(account);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Role.Admin)]
    [HttpPost("admin-create-user")]
    public async Task<ActionResult<AccountResponse>> Create(CreateRequest model)
    {
        try
        {
            var account = await _accountService.Create(model);
            return Ok(account);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("update-user/{id:Guid}")]
    public async Task<ActionResult<AccountResponse>> UpdateUser(Guid id, UpdateRequest model)
    {
        try
        {
            // users can update their own account and admins can update any account
            if (id != Account.Id && Account.Role != Role.Admin)
                return Unauthorized(new { message = "Unauthorized" });

            // only admins can update role
            if (Account.Role != Role.Admin)
                model.Role = null;

            var account = await _accountService.UpdateUser(id, model);
            return Ok(account);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("delete-user/{id:Guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            // users can delete their own account and admins can delete any account
            if (id != Account.Id && Account.Role != Role.Admin)
                return Unauthorized(new { message = "Unauthorized" });

            await _accountService.Delete(id);
            return Ok(new { message = "Account deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // helper methods
    private void setTokenCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }

    private string ipAddress()
    {
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
            return Request.Headers["X-Forwarded-For"]!;
        else
            return HttpContext.Connection.RemoteIpAddress!.MapToIPv4().ToString();
    }
}
