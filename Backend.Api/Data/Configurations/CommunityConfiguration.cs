// // Backend.Api/Data/Configurations/CommunityConfiguration.cs

// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;
// using Backend.Api.Modules.CommunityService.Entities; // Namespace của Entity Community
// using Backend.Api.Modules.UserService.Entities; // Namespace của Entity User (cho mối quan hệ CreatedBy)

// namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
// {
//     public class CommunityConfiguration : IEntityTypeConfiguration<Community>
//     {
//         public void Configure(EntityTypeBuilder<Community> builder)
//         {
//             // Configure Primary Key
//             builder.HasKey(c => c.Id);

//             // Configure Unique Index on Slug
//             builder.HasIndex(c => c.Slug)
//                    .IsUnique();

//             // Configure Many-to-One relationship to User (Creator)
//             builder.HasOne(c => c.CreatedBy) // Each Community is created by ONE User
//                    .WithMany(u => u.CreatedCommunities) // That User has created MANY Communities
//                    .HasForeignKey(c => c.CreatedByUserId) // FK is on Community entity
//                    .IsRequired() // Relationship is required
//                    .OnDelete(DeleteBehavior.Restrict); // Prevent deleting User if they created Communities

//             builder.HasMany(c => c.ReportsOnThisCommunity) // Mỗi Community có NHIỀU Reports trỏ về nó
//                        .WithOne(r => r.ReportedCommunity) // Mỗi Report thuộc về MỘT Community bị báo cáo
//                        .HasForeignKey(r => r.ReportedCommunityId) // FK ReportedCommunityId nằm trong Report
//                        .IsRequired(false) // Mối quan hệ là tùy chọn
//                        .OnDelete(DeleteBehavior.Restrict);
//         }
//     }
// }