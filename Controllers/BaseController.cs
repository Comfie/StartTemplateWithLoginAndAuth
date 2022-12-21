using mcd_care_web.Entities;

namespace mcd_care_web.Controllers;
using Microsoft.AspNetCore.Mvc;


[Controller]
public abstract class BaseController : ControllerBase
{
    // returns the current authenticated account (null if not logged in)
    public User Account => (User)HttpContext.Items["User"]!;
}
