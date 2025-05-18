// Backend.Api/Data/Configurations/SpaceAmenityConfiguration.cs

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Api.Modules.SpaceService.Entities;

namespace Backend.Api.Data.Configurations
{
    public class SpaceAmenityConfiguration : IEntityTypeConfiguration<SpaceAmenity>
    {
        public void Configure(EntityTypeBuilder<SpaceAmenity> builder)
        {
            // Configure Primary Key
            builder.HasKey(sa => sa.SpaceAmenityId);

            // Configure Foreign Keys and Relationships

            // Many-to-One relationship to Space
            builder.HasOne(sa => sa.Space)
                   .WithMany(s => s.SpaceAmenities)
                   .HasForeignKey(sa => sa.SpaceId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Cascade); // Consider the onDelete behavior

            // Many-to-One relationship to Amenity
            builder.HasOne(sa => sa.Amenity)
                   .WithMany(a => a.SpaceAmenities)
                   .HasForeignKey(sa => sa.AmenityId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Cascade); // Consider the onDelete behavior

            // Optional: Configure unique index if you want to prevent duplicate Space-Amenity combinations
            builder.HasIndex(sa => new { sa.SpaceId, sa.AmenityId }).IsUnique();
        }
    }
}