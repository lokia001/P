// Backend.Api/Modules/AuthService/Dtos/ForgotPasswordRequestDto.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.AuthService.Dtos
{
    public class ForgotPasswordRequestDto
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string Email { get; set; } = string.Empty;
    }
}