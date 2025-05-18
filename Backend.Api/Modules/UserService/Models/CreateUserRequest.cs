namespace Backend.Api.Modules.UserService.Models;
using Backend.Api.Modules.UserService.Entities;
public class CreateUserRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public Role Role { get; set; } = Role.User; // Thêm dòng này: Role mặc định là User

    public string? CompanyName { get; set; } = string.Empty;
    public string? ContactInfo { get; set; }
    public string? AdditionalInfo { get; set; }
}