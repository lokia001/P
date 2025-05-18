// // Backend.Api/Data/Configurations/CommunityMemberConfiguration.cs

// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;
// using Backend.Api.Modules.CommunityService.Entities; // Namespace của Entity CommunityMember, Community, CommunityPolicy
// using Backend.Api.Modules.UserService.Entities; // Namespace của Entity User

// namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
// {
//     public class CommunityMemberConfiguration : IEntityTypeConfiguration<CommunityMember>
//     {
//         public void Configure(EntityTypeBuilder<CommunityMember> builder)
//         {
//             // Configure Primary Key
//             builder.HasKey(cm => cm.Id);

//             // Configure Composite Unique Index on CommunityId and UserId
//             builder.HasIndex(cm => new { cm.CommunityId, cm.UserId })
//                    .IsUnique();

//             // Configure Many-to-One relationship to Community
//             builder.HasOne(cm => cm.Community) // Mỗi Membership links to ONE Community
//                    .WithMany(c => c.CommunityMembers) // That Community has MANY Memberships
//                    .HasForeignKey(cm => cm.CommunityId) // FK is on CommunityMember
//                    .IsRequired() // Relationship is required
//                    .OnDelete(DeleteBehavior.Cascade); // Delete Memberships if Community is deleted

//             // Configure Many-to-One relationship to User (the member)
//             builder.HasOne(cm => cm.User) // Mỗi Membership links to ONE User (the member)
//                    .WithMany(u => u.CommunityMembers) // That User is a member of MANY Communities (via Membership)
//                    .HasForeignKey(cm => cm.UserId) // FK is on CommunityMember
//                    .IsRequired() // Relationship is required
//                    .OnDelete(DeleteBehavior.Cascade); // Delete Memberships if User is deleted (Consider Restrict)

//             // --- BỔ SUNG: Cấu hình mối quan hệ Optional Many-to-One đến CommunityPolicy (Nội quy đã đồng ý) ---
//             builder.HasOne(cm => cm.AgreedPolicy) // Mỗi Membership *có thể* liên kết đến MỘT Policy đã đồng ý
//                    .WithMany(cp => cp.MembershipsAgreedToThisPolicy) // Policy đó *có thể* được đồng ý bởi NHIỀU Members (Không cần Nav Prop ngược trên CommunityPolicy nếu bạn không thêm ICollection<CommunityMember> vào CommunityPolicy)
//                                                                      // Nếu bạn đã thêm ICollection<CommunityMember>? MembershipsAgreedToThisPolicy vào CommunityPolicy, dùng: .WithMany(cp => cp.MembershipsAgreedToThisPolicy)
//                    .HasForeignKey(cm => cm.AgreedPolicyId) // FK AgreedPolicyId nằm trong CommunityMember
//                    .IsRequired(false); // Mối quan hệ là tùy chọn (FK là nullable)

//         }
//     }
// }