// Backend.Api/Modules/AuthService/Entities/PasswordResetToken.cs (hoặc vị trí phù hợp)
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Api.Modules.UserService.Entities; // Namespace của User

namespace Backend.Api.Modules.AuthService.Entities
{
    public class PasswordResetToken
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Token { get; set; } = string.Empty; // Giá trị của reset token (chuỗi ngẫu nhiên)

        [Required]
        public Guid UserId { get; set; } // Khóa ngoại trỏ đến User
        [ForeignKey("UserId")]
        public User User { get; set; } = default!;

        [Required]
        public DateTime ExpiresAt { get; set; } // Thời gian hết hạn của token

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UsedAt { get; set; } // Thời điểm token được sử dụng (nếu muốn theo dõi)

        public bool IsActive => UsedAt == null && ExpiresAt >= DateTime.UtcNow;
    }
}