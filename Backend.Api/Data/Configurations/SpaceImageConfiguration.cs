// Backend.Api/Modules/SpaceService/Configurations/SpaceImageConfiguration.cs
using Backend.Api.Modules.SpaceService.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Api.Modules.SpaceService.Configurations
{
    public class SpaceImageConfiguration : IEntityTypeConfiguration<SpaceImage>
    {
        public void Configure(EntityTypeBuilder<SpaceImage> builder)
        {
            #region Table Configuration

            builder.ToTable("SpaceImages"); // Optional: Specify table name

            builder.HasKey(si => si.Id);

            #endregion

            #region Property Configurations

            builder.Property(si => si.SpaceId)
                .IsRequired();

            builder.Property(si => si.ImageUrl)
                .IsRequired()
                .HasMaxLength(255); // Example: Limit image URL length

            builder.Property(si => si.DisplayOrder)
                .IsRequired()
                .HasDefaultValue(0);

            #endregion

            #region Relationship Configurations

            builder.HasOne(si => si.Space)
                .WithMany(s => s.SpaceImages) // Assuming Space entity has a collection navigation property named SpaceImages
                .HasForeignKey(si => si.SpaceId)
                .OnDelete(DeleteBehavior.Cascade); // Example: Define delete behavior

            #endregion
        }
    }
}