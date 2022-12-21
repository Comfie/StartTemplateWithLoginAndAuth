using System.ComponentModel.DataAnnotations;
using mcd_care_web.Entities;

namespace mcd_care_web.Models.Accounts;

public class CreateRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EnumDataType(typeof(Role))]
    public string Role { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Compare("Password")]
    public string ConfirmPassword { get; set; } = string.Empty;
}
