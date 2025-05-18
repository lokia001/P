// // Backend.Api/Data/Configurations/ReportConfiguration.cs

// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// // --- Usings for entities involved in relationships ---
// using Backend.Api.Modules.ReportService.Entities; // Cho Report và Enums
// using Backend.Api.Modules.UserService.Entities;    // Cho User (Reporter, Reviewer, Reported User)
// // Cần usings cho tất cả các entity có thể bị báo cáo
// using Backend.Api.Modules.PostService.Entities; // Cho Post
// using Backend.Api.Modules.CommentService.Entities; // Cho Comment
// using Backend.Api.Modules.SpaceService.Entities; // Cho Space
// using Backend.Api.Modules.CommunityService.Entities; // Cho Community


// namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
// {
//     public class ReportConfiguration : IEntityTypeConfiguration<Report>
//     {
//         public void Configure(EntityTypeBuilder<Report> builder)
//         {
//             // Configure Primary Key
//             builder.HasKey(r => r.Id);

//             // Configure Many-to-One relationship to User (Reporter)
//             builder.HasOne(r => r.ReporterUser) // Mỗi Report được gửi bởi MỘT User
//                    .WithMany(u => u.SubmittedReports) // User đó đã gửi NHIỀU Reports
//                    .HasForeignKey(r => r.ReporterUserId) // FK ReporterUserId nằm trong Report
//                    .IsRequired() // Relationship is required
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa User nếu họ còn Reports đã gửi

//             // Configure Optional Many-to-One relationship to User (Reviewer)
//             builder.HasOne(r => r.ReviewedByUser) // Mỗi Report *có thể* được xem xét bởi MỘT User
//                    .WithMany(u => u.ReviewedReports) // User đó đã xem xét NHIỀU Reports
//                    .HasForeignKey(r => r.ReviewedByUserId) // FK ReviewedByUserId nằm trong Report (có thể null)
//                    .IsRequired(false) // Mối quan hệ là tùy chọn
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa User nếu họ còn Reports đã xem xét

//             // Configure Enum to string conversion
//             builder.Property(r => r.Reason)
//                    .HasConversion<string>();

//             builder.Property(r => r.Status)
//                    .HasConversion<string>();

//             // *** BỔ SUNG: Cấu hình các mối quan hệ Optional Many-to-One đến đối tượng bị báo cáo ***

//             builder.HasOne(r => r.ReportedPost) // Mỗi Report *có thể* thuộc về MỘT Post
//                    .WithMany(p => p.ReportsOnThisPost) // Post đó có NHIỀU Reports trỏ về nó
//                    .HasForeignKey(r => r.ReportedPostId) // FK ReportedPostId nằm trong Report
//                    .IsRequired(false) // Mối quan hệ là tùy chọn
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa Post nếu còn Reports trỏ đến nó

//             builder.HasOne(r => r.ReportedComment) // Mỗi Report *có thể* thuộc về MỘT Comment
//                    .WithMany(c => c.ReportsOnThisComment) // Comment đó có NHIỀU Reports trỏ về nó
//                    .HasForeignKey(r => r.ReportedCommentId) // FK ReportedCommentId nằm trong Report
//                    .IsRequired(false) // Mối quan hệ là tùy chọn
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa Comment nếu còn Reports trỏ đến nó

//             builder.HasOne(r => r.ReportedUser) // Mỗi Report *có thể* thuộc về MỘT User (bị báo cáo)
//                    .WithMany(u => u.ReportsOnThisUser) // User đó có NHIỀU Reports trỏ về nó
//                    .HasForeignKey(r => r.ReportedUserId) // FK ReportedUserId nằm trong Report
//                    .IsRequired(false) // Mối quan hệ là tùy chọn
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa User nếu còn Reports trỏ đến nó

//             builder.HasOne(r => r.ReportedSpace) // Mỗi Report *có thể* thuộc về MỘT Space
//                    .WithMany(s => s.ReportsOnThisSpace) // Space đó có NHIỀU Reports trỏ về nó
//                    .HasForeignKey(r => r.ReportedSpaceId) // FK ReportedSpaceId nằm trong Report
//                    .IsRequired(false) // Mối quan hệ là tùy chọn
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa Space nếu còn Reports trỏ đến nó

//             builder.HasOne(r => r.ReportedCommunity) // Mỗi Report *có thể* thuộc về MỘT Community
//                    .WithMany(c => c.ReportsOnThisCommunity) // Community đó có NHIỀU Reports trỏ về nó
//                    .HasForeignKey(r => r.ReportedCommunityId) // FK ReportedCommunityId nằm trong Report
//                    .IsRequired(false) // Mối quan hệ là tùy chọn
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa Community nếu còn Reports trỏ đến nó


//             // *** LƯU Ý QUAN TRỌNG VỀ RÀNG BUỘC "CHỈ MỘT CÓ GIÁ TRỊ" ***
//             // Cấu hình này tạo ra các FK độc lập. EF Core không tự động đảm bảo
//             // chỉ MỘT TRONG CÁC FK (ReportedPostId, ReportedCommentId, ..., ReportedCommunityId)
//             // có giá trị khác NULL.
//             // Bạn CẦN xử lý việc này bằng code ứng dụng khi tạo/cập nhật Report
//             // hoặc thêm Check Constraint vào Database thủ công để đảm bảo tính toàn vẹn dữ liệu.
//         }
//     }
// }