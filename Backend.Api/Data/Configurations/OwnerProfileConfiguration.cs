// Backend.Api/Data/Configurations/OwnerProfileConfiguration.cs

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Api.Modules.UserService.Entities; // Namespace của Entity OwnerProfile

namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
{
    public class OwnerProfileConfiguration : IEntityTypeConfiguration<OwnerProfile>
    {
        public void Configure(EntityTypeBuilder<OwnerProfile> builder)
        {
            // Configure Primary Key (UserId is also FK to User)
            builder.HasKey(op => op.UserId);

            // Configure 1-0/1 relationship with User (OwnerProfile is the dependent side)
            // FK is defined by the Key property UserId
            builder.HasOne(op => op.User) // Each OwnerProfile has ONE User
                   .WithOne(u => u.OwnerProfile) // That User has ONE OwnerProfile
                   .HasForeignKey<OwnerProfile>(op => op.UserId) // FK is on OwnerProfile entity
                   .IsRequired(); // Relationship is required
        }
    }
}