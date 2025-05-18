// Backend.Api/Modules/AuthService/Dtos/LoginRequestDto.cs (hoặc vị trí phù hợp)
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.UserService.Models
{
    public class LoginRequestDto
    {
        [Required(ErrorMessage = "Username is required.")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; } = string.Empty;
    }
}