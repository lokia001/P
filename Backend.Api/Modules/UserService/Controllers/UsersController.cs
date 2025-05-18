using Backend.Api.Modules.UserService.Entities;
using Backend.Api.Modules.UserService.Models;
using Backend.Api.Modules.UserService.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Logging;
using Backend.Api.Modules.UserService.Models;
using Backend.Api.Modules.UserService.Services;
namespace Backend.Api.Modules.UserService.Controllers;

using System.ComponentModel.DataAnnotations;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;


    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        try
        {
            // Attempt to get the user ID from the claims
            if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out Guid userId))
            {
                _logger.LogWarning("Unable to determine user ID from claims during logout.");
                return BadRequest(new { message = "Unable to determine user ID from claims." });
            }

            // Log the logout action
            _logger.LogInformation($"User {userId} is logging out.");

            // Call the LogoutAsync method from the user service to perform any necessary server-side logout actions
            var logoutResult = await _userService.LogoutAsync(userId);

            // If the logout operation fails for some reason, return a 500 Internal Server Error
            if (!logoutResult)
            {
                _logger.LogError($"Logout failed for user {userId}.");
                return StatusCode(500, new { message = "An error occurred during logout." }); // Return an object
            }

            // If the logout operation is successful, return a 200 OK with a success message
            return Ok(new { message = "Logout successful." });  // Return an object
        }
        catch (Exception ex)
        {
            // Log the exception for debugging purposes
            _logger.LogError(ex, "Error occurred during logout.");

            // Return a 500 Internal Server Error if an exception occurs
            return StatusCode(500, new { message = "Internal server error" }); // Return an object
        }
    }




    // Add other user-related endpoints
}

public class LoginRequest  //Model
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse //Model
{
    public string Token { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class RegisterRequest //Model
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Compare("Password", ErrorMessage = "Passwords do not match.")]
    public string ConfirmPassword { get; set; } = string.Empty;

    public Role Role { get; set; } = Role.User; //Default role

    public string? CompanyName { get; set; } = string.Empty;
    public string? ContactInfo { get; set; }
    public string? AdditionalInfo { get; set; }

}