// // Backend.Api/Data/Configurations/OwnerProfileMembershipConfiguration.cs

// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;
// using Backend.Api.Modules.UserService.Entities; // Namespace của Entity OwnerProfileMembership

// namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
// {
//     public class OwnerProfileMembershipConfiguration : IEntityTypeConfiguration<OwnerProfileMembership>
//     {
//         public void Configure(EntityTypeBuilder<OwnerProfileMembership> builder)
//         {
//             // Configure Primary Key
//             builder.HasKey(opm => opm.Id);

//             // Configure Composite Unique Index on OwnerProfileId and UserId
//             builder.HasIndex(opm => new { opm.OwnerProfileId, opm.UserId })
//                    .IsUnique();

//             // Configure Many-to-One relationship to OwnerProfile
//             builder.HasOne(opm => opm.OwnerProfile) // Each Membership links to ONE OwnerProfile
//                    .WithMany(op => op.Memberships) // That OwnerProfile has MANY Memberships
//                    .HasForeignKey(opm => opm.OwnerProfileId) // FK is on OwnerProfileMembership
//                    .IsRequired() // Relationship is required
//                    .OnDelete(DeleteBehavior.Cascade); // Delete Memberships if OwnerProfile is deleted

//             // Configure Many-to-One relationship to User (the member)
//             builder.HasOne(opm => opm.User) // Each Membership links to ONE User (the member)
//                    .WithMany(u => u.OwnerProfileMemberships) // That User has MANY Memberships
//                    .HasForeignKey(opm => opm.UserId) // FK is on OwnerProfileMembership
//                    .IsRequired() // Relationship is required
//                    .OnDelete(DeleteBehavior.Cascade); // Delete Memberships if User is deleted (Consider Restrict)

//             // Configure Optional Many-to-One relationship to User (the assigner)
//             builder.HasOne(opm => opm.AssignedByUser) // Each Membership *may* be assigned by ONE User
//                    .WithMany(u => u.AssignedMemberships) // That User *may* have assigned MANY Memberships (Requires ICollection<OwnerProfileMembership>? AssignedMemberships in User)
//                    .HasForeignKey(opm => opm.AssignedByUserId) // FK is on OwnerProfileMembership
//                    .IsRequired(false); // Relationship is optional (FK is nullable)
//         }
//     }
// }