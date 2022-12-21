using System.ComponentModel.DataAnnotations;

namespace mcd_care_web.Models.Accounts;

public class ForgotPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
