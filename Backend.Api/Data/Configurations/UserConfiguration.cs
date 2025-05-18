// Backend.Api/Data/Configurations/UserConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Api.Modules.UserService.Entities; // Namespace của Entity User

namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
{
    // Triển khai interface IEntityTypeConfiguration<User>
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        // Implement phương thức Configure
        public void Configure(EntityTypeBuilder<User> builder)
        {
            // Di chuyển cấu hình Index cho User từ OnModelCreating vào đây
            builder.HasIndex(u => u.Username)
                   .IsUnique();


            // Cấu hình mối quan hệ Reports đã gửi (SubmittedReports) và Reports đã review (ReviewedReports)
            // builder.HasMany(u => u.SubmittedReports).WithOne(r => r.ReporterUser).HasForeignKey(r => r.ReporterUserId).IsRequired().OnDelete(DeleteBehavior.Restrict);
            // builder.HasMany(u => u.ReviewedReports).WithOne(r => r.ReviewedByUser).HasForeignKey(r => r.ReviewedByUserId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
            // Cấu hình các mối quan hệ khác (ReportedDamages, ResolvedDamages, CreatedExtraCharges, AddedServiceItems, AssignedMemberships)

            // *** BỔ SUNG: Cấu hình mối quan hệ One-to-Many đến Reports on this User ***
            // builder.HasMany(u => u.ReportsOnThisUser) // Mỗi User có NHIỀU Reports trỏ về nó
            //    .WithOne(r => r.ReportedUser) // Mỗi Report thuộc về MỘT User bị báo cáo
            //    .HasForeignKey(r => r.ReportedUserId) // FK ReportedUserId nằm trong Report
            //    .IsRequired(false) // Mối quan hệ là tùy chọn
            //    .OnDelete(DeleteBehavior.Restrict);
        }
    }
}