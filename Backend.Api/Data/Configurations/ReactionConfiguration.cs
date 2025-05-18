// // Backend.Api/Data/Configurations/ReactionConfiguration.cs

// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// // --- Usings for entities involved in relationships ---
// using Backend.Api.Modules.ReactionService.Entities; // Cho Reaction và Enums
// using Backend.Api.Modules.UserService.Entities;    // Cho User
// // Cần usings cho Post và Comment
// using Backend.Api.Modules.PostService.Entities; // Cho Post
// using Backend.Api.Modules.CommentService.Entities; // Cho Comment


// namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
// {
//     public class ReactionConfiguration : IEntityTypeConfiguration<Reaction>
//     {
//         public void Configure(EntityTypeBuilder<Reaction> builder)
//         {
//             // Configure Primary Key
//             builder.HasKey(r => r.Id);

//             // Configure Many-to-One relationship to User (Reactor)
//             builder.HasOne(r => r.User) // Mỗi Reaction được tạo bởi MỘT User
//                    .WithMany(u => u.Reactions) // User đó đã tạo NHIỀU Reactions
//                    .HasForeignKey(r => r.UserId) // FK UserId nằm trong Reaction
//                    .IsRequired() // Relationship is required (UserId không nullable)
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa User nếu họ còn Reactions

//             // Configure Enum to string conversion for ReactionType (TargetType đã xóa)
//             builder.Property(r => r.ReactionType)
//                    .HasConversion<string>(); // Lưu ReactionType dưới dạng chuỗi

//             // *** BỔ SUNG: Cấu hình mối quan hệ Optional Many-to-One đến Post ***
//             builder.HasOne(r => r.Post) // Mỗi Reaction *có thể* thuộc về MỘT Post
//                    .WithMany(p => p.Reactions) // Post đó có NHIỀU Reactions trỏ về nó (Sử dụng Nav Prop trong Post.cs)
//                    .HasForeignKey(r => r.PostId) // FK PostId nằm trong Reaction (có thể null)
//                    .IsRequired(false) // Mối quan hệ là tùy chọn (PostId nullable)
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa Post nếu còn Reactions trỏ đến

//             // *** BỔ SUNG: Cấu hình mối quan hệ Optional Many-to-One đến Comment ***
//             builder.HasOne(r => r.Comment) // Mỗi Reaction *có thể* thuộc về MỘT Comment
//                    .WithMany(c => c.Reactions) // Comment đó có NHIỀU Reactions trỏ về nó (Sử dụng Nav Prop trong Comment.cs)
//                    .HasForeignKey(r => r.CommentId) // FK CommentId nằm trong Reaction (có thể null)
//                    .IsRequired(false) // Mối quan hệ là tùy chọn (CommentId nullable)
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa Comment nếu còn Reactions trỏ đến

//             // *** LƯU Ý: Logic ứng dụng hoặc Ràng buộc DB ***
//             // Cấu hình này không tự động đảm bảo chỉ MỘT TRONG HAI (PostId hoặc CommentId) khác NULL.
//             // Bạn cần xử lý việc này bằng code ứng dụng khi tạo/cập nhật Reaction
//             // hoặc thêm Check Constraint vào Database thủ công.
//         }
//     }
// }