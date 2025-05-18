// Backend.Api/Modules/AuthService/Entities/RefreshToken.cs (hoặc vị trí phù hợp)
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Api.Modules.UserService.Entities; // Namespace của User

namespace Backend.Api.Modules.AuthService.Entities
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; } // Khóa chính tự tăng

        [Required]
        public string Token { get; set; } = string.Empty; // Giá trị của refresh token (chuỗi ngẫu nhiên dài)

        [Required]
        public Guid UserId { get; set; } // Khóa ngoại trỏ đến User
        [ForeignKey("UserId")]
        public User User { get; set; } = default!;

        [Required]
        public DateTime ExpiresAt { get; set; } // Thời gian hết hạn của refresh token

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? RevokedAt { get; set; } // Thời điểm token bị thu hồi (khi logout hoặc khi refresh)

        public string? ReplacedByToken { get; set; } // Lưu token mới đã thay thế token này (giúp phát hiện lạm dụng)

        public bool IsActive => RevokedAt == null && ExpiresAt >= DateTime.UtcNow; // Thuộc tính tính toán

        // Tùy chọn: Thông tin thiết bị để tăng cường bảo mật
        public string? DeviceIdentifier { get; set; } // Ví dụ: User-Agent, IP Address (cân nhắc GDPR)
        public string? IpAddress { get; set; }
    }
}