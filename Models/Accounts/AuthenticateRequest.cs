using System.ComponentModel.DataAnnotations;

namespace mcd_care_web.Models.Accounts;

public class AuthenticateRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
}
