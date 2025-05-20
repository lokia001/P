// Backend.Api/Data/Configurations/OwnerProfileConfiguration.cs

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Api.Modules.UserService.Entities;
using Backend.Api.Modules.AuthService.Entities; // Namespace của Entity OwnerProfile

namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
{
    public class PasswordResetTokenConfiguration : IEntityTypeConfiguration<PasswordResetToken>
    {
        public void Configure(EntityTypeBuilder<PasswordResetToken> builder)
        {
            builder.HasIndex(prt => prt.Token).IsUnique();

            // Đảm bảo token là duy nhất
            builder.HasOne(prt => prt.User)
                  .WithMany() // Một User có thể có nhiều PasswordResetToken (ví dụ, nếu yêu cầu nhiều lần)
                  .HasForeignKey(prt => prt.UserId)
                  .OnDelete(DeleteBehavior.Cascade); // Khi User bị xóa, token liên quan cũng bị xóa
        }
    }
}