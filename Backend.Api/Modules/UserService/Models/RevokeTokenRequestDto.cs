// Backend.Api/Modules/AuthService/Dtos/RevokeTokenRequestDto.cs (Dùng cho Logout)
using System.ComponentModel.DataAnnotations;
namespace Backend.Api.Modules.AuthService.Dtos
{
    public class RevokeTokenRequestDto // Có thể giống RefreshTokenRequestDto
    {
        [Required]
        public string Token { get; set; } = string.Empty;
    }
}