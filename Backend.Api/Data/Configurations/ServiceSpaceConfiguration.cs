// Backend.Api/Modules/SpaceService/Configurations/SpaceServiceConfiguration.cs
using Backend.Api.Modules.SpaceService.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Api.Modules.SpaceService.Configurations
{
    public class SpaceServiceConfiguration : IEntityTypeConfiguration<ServiceSpace>
    {
        public void Configure(EntityTypeBuilder<ServiceSpace> builder)
        {
            #region Table Configuration

            builder.ToTable("ServicesSpaces"); // Optional: Specify table name

            builder.HasKey(ss => ss.Id); // Config khóa chính

            // Nếu bạn muốn dùng composite key (SpaceId, ServiceId):
            // builder.HasKey(ss => new { ss.SpaceId, ss.ServiceId });

            #endregion

            #region Property Configurations

            // builder.Property(ss => ss.Notes)
            //     .HasMaxLength(255); // Ví dụ: Giới hạn độ dài cho Notes

            builder.Property(ss => ss.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()"); // Ví dụ: Giá trị mặc định khi tạo

            #endregion

            #region Relationship Configurations

            // Cấu hình mối quan hệ với Space
            builder.HasOne(ss => ss.Space)
            .WithMany(s => s.ServiceSpaces) // Giả sử Space entity có collection navigation property SpaceServices
            .HasForeignKey(ss => ss.SpaceId)
            .OnDelete(DeleteBehavior.Cascade); // Hành vi xóa khi Space bị xóa

            // Cấu hình mối quan hệ với Service
            builder.HasOne(ss => ss.Service)
                .WithMany(se => se.ServiceSpaces) // Giả sử Service entity có collection navigation property SpaceServices
                .HasForeignKey(ss => ss.ServiceId)
                .OnDelete(DeleteBehavior.Cascade); // Hành vi xóa khi Service bị xóa

            #endregion
        }
    }
}