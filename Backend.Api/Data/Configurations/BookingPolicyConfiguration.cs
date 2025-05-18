// // Backend.Api/Data/Configurations/BookingPolicyConfiguration.cs

// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// // --- Usings for related entities ---
// using Backend.Api.Modules.BookingService.Entities; // Namespace của Entity BookingPolicy
// using Backend.Api.Modules.UserService.Entities; // Cho OwnerProfile
// using Backend.Api.Modules.SpaceService.Entities; // Cho Space

// namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
// {
//     public class BookingPolicyConfiguration : IEntityTypeConfiguration<BookingPolicy>
//     {
//         public void Configure(EntityTypeBuilder<BookingPolicy> builder)
//         {
//             // Configure Primary Key
//             builder.HasKey(bp => bp.Id);

//             // Configure Optional Many-to-One relationship to OwnerProfile
//             builder.HasOne(bp => bp.OwnerProfile) // Mỗi Policy *có thể* thuộc về MỘT OwnerProfile
//                    .WithMany(op => op.Policies) // OwnerProfile đó có NHIỀU Policies (Cần thêm ICollection<BookingPolicy>? Policies vào OwnerProfile.cs)
//                    .HasForeignKey(bp => bp.OwnerProfileId) // FK OwnerProfileId nằm trong BookingPolicy
//                    .IsRequired(false) // Mối quan hệ là tùy chọn (FK là nullable)
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa OwnerProfile nếu còn Policy liên quan

//             // Configure Optional Many-to-One relationship to Space
//             builder.HasOne(bp => bp.Space) // Mỗi Policy *có thể* thuộc về MỘT Space
//                    .WithMany(s => s.Policies) // Space đó có NHIỀU Policies (Cần thêm ICollection<BookingPolicy>? Policies vào Space.cs)
//                    .HasForeignKey(bp => bp.SpaceId) // FK SpaceId nằm trong BookingPolicy
//                    .IsRequired(false) // Mối quan hệ là tùy chọn (FK là nullable)
//                    .OnDelete(DeleteBehavior.Restrict); // Không xóa Space nếu còn Policy liên quan

//             // Configure Composite Unique Index on OwnerProfileId, SpaceId, and Version
//             // Cấu hình này đảm bảo tính duy nhất cho sự kết hợp của OwnerProfile, Space, và Version.
//             // Nó cho phép các trường OwnerProfileId và SpaceId là NULL.
//             // Ví dụ:
//             // - Một chính sách chung cho Owner A (OwnerId=A, SpaceId=NULL, Version=1.0) là duy nhất.
//             // - Một chính sách riêng cho Space X (OwnerId=NULL, SpaceId=X, Version=1.0) là duy nhất.
//             // - Nếu có chính sách chung cho Owner A và chính sách riêng cho Space X, cả hai đều Version 1.0, vẫn được chấp nhận.
//             // - Nếu có 2 chính sách chung cho Owner A với cùng Version 1.0, sẽ bị lỗi Unique Index.
//             // - Nếu có 2 chính sách riêng cho Space X với cùng Version 1.0, sẽ bị lỗi Unique Index.
//             // - Một chính sách "toàn cầu" (cả OwnerProfileId và SpaceId đều NULL, Version=1.0) là duy nhất.
//             builder.HasIndex(bp => new { bp.OwnerProfileId, bp.SpaceId, bp.Version })
//                    .IsUnique();

//             // Configure TEXT column type for Content if using databases like SQLite/PostgreSQL for large text
//             // builder.Property(bp => bp.Content)
//             //        .HasColumnType("TEXT");
//         }
//     }
// }