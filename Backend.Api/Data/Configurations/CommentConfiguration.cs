// // Backend.Api/Data/Configurations/CommentConfiguration.cs

// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// // --- Usings for entities involved in relationships ---
// using Backend.Api.Modules.CommentService.Entities; // Cho Comment
// using Backend.Api.Modules.PostService.Entities;    // Cho Post
// using Backend.Api.Modules.UserService.Entities;    // Cho User

// namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
// {
//     public class CommentConfiguration : IEntityTypeConfiguration<Comment>
//     {
//         public void Configure(EntityTypeBuilder<Comment> builder)
//         {
//             // Configure Primary Key
//             builder.HasKey(c => c.Id);



//             // Configure Many-to-One relationship to Post
//             builder.HasOne(c => c.Post) // Mỗi Comment thuộc về MỘT Post
//                    .WithMany(p => p.Comments) // Post đó có NHIỀU Comments
//                    .HasForeignKey(c => c.PostId) // FK PostId nằm trong Comment
//                    .IsRequired() // Relationship is required
//                    .OnDelete(DeleteBehavior.Cascade); // Xóa Comments nếu Post bị xóa

//             // Configure Many-to-One relationship to User (Author)
//             builder.HasOne(c => c.User) // Mỗi Comment được viết bởi MỘT User
//                    .WithMany(u => u.Comments) // User đó đã viết NHIỀU Comments
//                    .HasForeignKey(c => c.UserId) // FK UserId nằm trong Comment
//                    .IsRequired() // Relationship is required
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa User nếu họ còn Comments

//             // Configure Self-referencing relationship (Many-to-One to Parent Comment)
//             builder.HasOne(c => c.ParentComment) // Mỗi Comment *có thể* có MỘT Comment cha
//                    .WithMany(c => c.Replies) // Comment cha đó có NHIỀU Replies
//                    .HasForeignKey(c => c.ParentCommentId) // FK ParentCommentId nằm trong Comment (có thể null)
//                    .IsRequired(false) // Relationship is optional (cho Comments cấp cao nhất)
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa Comment cha nếu còn Replies trỏ đến


//             builder.HasMany(c => c.Reactions) // Mỗi Comment có NHIỀU Reactions trỏ về nó (Sử dụng Nav Prop trong Comment.cs)
//                                .WithOne(r => r.Comment) // Mỗi Reaction thuộc về MỘT Comment (Sử dụng Nav Prop trong Reaction.cs)
//                                .HasForeignKey(r => r.CommentId) // FK CommentId nằm trong Reaction
//                                .IsRequired(false) // Mối quan hệ là tùy chọn (Reaction.CommentId có thể null)
//                                .OnDelete(DeleteBehavior.Restrict); // Không xóa Comment nếu còn Reactions trỏ đến nó

//             builder.HasMany(c => c.ReportsOnThisComment) // Mỗi Comment có NHIỀU Reports trỏ về nó
//                     .WithOne(r => r.ReportedComment) // Mỗi Report thuộc về MỘT Comment bị báo cáo
//                     .HasForeignKey(r => r.ReportedCommentId) // FK ReportedCommentId nằm trong Report
//                     .IsRequired(false) // Mối quan hệ là tùy chọn
//                     .OnDelete(DeleteBehavior.Restrict); // Không xóa Comment nếu còn Reports trỏ đến nó

//             // Mối quan hệ One-to-Many đến Report sẽ được cấu hình trong ReportConfiguration.cs
//             // vì Report là phía "Nhiều" của mối quan hệ này.
//         }
//     }
// }