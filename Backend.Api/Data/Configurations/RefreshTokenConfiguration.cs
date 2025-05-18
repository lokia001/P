// Backend.Api/Data/Configurations/OwnerProfileConfiguration.cs

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Api.Modules.UserService.Entities;
using Backend.Api.Modules.AuthService.Entities; // Namespace của Entity OwnerProfile

namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
{
    public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
    {
        public void Configure(EntityTypeBuilder<RefreshToken> builder)
        {
            // Configure Primary Key (UserId is also FK to User)
            builder.HasIndex(rt => rt.Token).IsUnique(); // Đảm bảo token là duy nhất

            // Configure 1-0/1 relationship with User (OwnerProfile is the dependent side)
            // FK is defined by the Key property UserId
            builder.HasOne(rt => rt.User)
          .WithMany() // Một User có thể có nhiều RefreshToken (nếu cho phép nhiều phiên/thiết bị)
          .HasForeignKey(rt => rt.UserId)
          .OnDelete(DeleteBehavior.Cascade); // Khi User bị xóa, RefreshToken liên quan cũng bị xóa
        }
    }
}