using mcd_care_web.Entities.Context;
using mcd_care_web.Helpers;
using Microsoft.Extensions.Options;

namespace mcd_care_web.Authorization;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly AppSettings _appSettings;

    public JwtMiddleware(RequestDelegate next, IOptions<AppSettings> appSettings)
    {
        _next = next;
        _appSettings = appSettings.Value;
    }

    public async Task Invoke(HttpContext context, AppDataContext dataContext, IJwtUtils jwtUtils)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        var accountId = jwtUtils.ValidateJwtToken(token);
        if (accountId != null)
        {
            // attach account to context on successful jwt validation
            context.Items["User"] = dataContext.Users.FirstOrDefault(user => user.Id.ToString() == accountId);
        }

        await _next(context);
    }
}
