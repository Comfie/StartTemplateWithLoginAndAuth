using System.ComponentModel.DataAnnotations;

namespace mcd_care_web.Models.Accounts;

public class ValidateResetTokenRequest
{
    [Required]
    public string Token { get; set; } = string.Empty;
}
