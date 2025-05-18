// Backend.Api/Modules/AuthService/Dtos/LoginResponseDto.cs (Cập nhật)
using Backend.Api.Modules.UserService.Models;
namespace Backend.Api.Modules.AuthService.Dtos
{
    public class LoginResponseDto
    {
        public string AccessToken { get; set; } = string.Empty; // Đổi tên từ Token
        public string RefreshToken { get; set; } = string.Empty; // Thêm RefreshToken
        public UserDto User { get; set; } = default!;
        public DateTime AccessTokenExpiresAt { get; set; } // Thời gian hết hạn của Access Token
    }
}