// // Backend.Api/Data/Configurations/PostConfiguration.cs

// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// // --- Usings for entities involved in relationships ---
// using Backend.Api.Modules.PostService.Entities;    // Cho Post
// using Backend.Api.Modules.CommunityService.Entities; // Cho Community
// using Backend.Api.Modules.UserService.Entities;    // Cho User
// using Backend.Api.Modules.CommentService.Entities; // Cho Comment

// namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
// {
//     public class PostConfiguration : IEntityTypeConfiguration<Post>
//     {
//         public void Configure(EntityTypeBuilder<Post> builder)
//         {
//             // Configure Primary Key
//             builder.HasKey(p => p.Id);

//             // Configure Composite Unique Index on CommunityId and Slug
//             // Đảm bảo Slug là duy nhất trong phạm vi một Community
//             builder.HasIndex(p => new { p.CommunityId, p.Slug })
//                    .IsUnique();

//             // Configure Many-to-One relationship to Community
//             builder.HasOne(p => p.Community) // Mỗi Post thuộc về MỘT Community
//                    .WithMany(c => c.Posts) // Community đó có NHIỀU Posts
//                    .HasForeignKey(p => p.CommunityId) // FK CommunityId nằm trong Post
//                    .IsRequired() // Relationship is required
//                    .OnDelete(DeleteBehavior.Cascade); // Xóa Posts nếu Community bị xóa

//             // Configure Many-to-One relationship to User (Author)
//             builder.HasOne(p => p.User) // Mỗi Post được viết bởi MỘT User
//                    .WithMany(u => u.Posts) // User đó đã viết NHIỀU Posts
//                    .HasForeignKey(p => p.UserId) // FK UserId nằm trong Post
//                    .IsRequired() // Relationship is required
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa User nếu họ còn Posts

//             // Configure One-to-Many relationship to Comments
//             builder.HasMany(p => p.Comments) // Mỗi Post có NHIỀU Comments
//                    .WithOne(c => c.Post) // Mỗi Comment thuộc về MỘT Post
//                    .HasForeignKey(c => c.PostId) // FK PostId nằm trong Comment
//                    .IsRequired() // Relationship is required
//                    .OnDelete(DeleteBehavior.Cascade); // Xóa Comments nếu Post bị xóa


//             builder.HasMany(p => p.Reactions) // Mỗi Post có NHIỀU Reactions trỏ về nó (Sử dụng Nav Prop trong Post.cs)
//                               .WithOne(r => r.Post) // Mỗi Reaction thuộc về MỘT Post (Sử dụng Nav Prop trong Reaction.cs)
//                               .HasForeignKey(r => r.PostId) // FK PostId nằm trong Reaction
//                               .IsRequired(false) // Mối quan hệ là tùy chọn (Reaction.PostId có thể null)
//                               .OnDelete(DeleteBehavior.Restrict); // Không xóa Post nếu còn Reactions trỏ đến nó

//             // *** BỔ SUNG: Cấu hình mối quan hệ One-to-Many đến Reports on this Post ***
//             builder.HasMany(p => p.ReportsOnThisPost) // Mỗi Post có NHIỀU Reports trỏ về nó
//                    .WithOne(r => r.ReportedPost) // Mỗi Report thuộc về MỘT Post bị báo cáo
//                    .HasForeignKey(r => r.ReportedPostId) // FK ReportedPostId nằm trong Report
//                    .IsRequired(false) // Mối quan hệ là tùy chọn (ReportedPostId có thể null)
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa Post nếu còn Reports trỏ đến nó

//             // Mối quan hệ One-to-Many đến Report sẽ được cấu hình trong ReportConfiguration.cs
//             // vì Report là phía "Nhiều" của mối quan hệ này (Report có FK PostId).
//         }
//     }
// }