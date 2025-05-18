namespace Backend.Api.Modules.UserService.Models;

using System;
using System.ComponentModel.DataAnnotations;
using Backend.Api.Modules.UserService.Entities;

public class RegisterRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Compare("Password", ErrorMessage = "Passwords do not match.")]
    public string ConfirmPassword { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public DateTime? DateOfBirth { get; set; }
    public Gender Gender { get; set; } = Gender.Unknown; // Male, Female, Other

    public string? Address { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Bio { get; set; }

    public Role Role { get; set; } = Role.User;

    // Chỉ cần nếu là Owner
    public string? CompanyName { get; set; }
    public string? ContactInfo { get; set; }
    public string? AdditionalInfo { get; set; }
}