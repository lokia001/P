// Backend.Api/Modules/AuthService/Dtos/RefreshTokenRequestDto.cs
using System.ComponentModel.DataAnnotations;
namespace Backend.Api.Modules.AuthService.Dtos
{
    public class RefreshTokenRequestDto
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}