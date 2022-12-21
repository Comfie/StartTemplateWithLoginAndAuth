using System.ComponentModel.DataAnnotations;
using mcd_care_web.Entities;

namespace mcd_care_web.Models.Accounts;

public class UpdateUserRoleRequest
{

    [Required]
    public string Role { get; set; } = string.Empty;

    [Required]
    public Guid UserId { get; set; }
}
