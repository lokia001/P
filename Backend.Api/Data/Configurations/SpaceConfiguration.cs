// Backend.Api/Data/Configurations/SpaceConfiguration.cs

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Api.Modules.SpaceService.Entities;

namespace Backend.Api.Data.Configurations
{
       public class SpaceConfiguration : IEntityTypeConfiguration<Space>
       {
              public void Configure(EntityTypeBuilder<Space> builder)
              {
                     // Configure Primary Key
                     builder.HasKey(s => s.Id);

                     // Configure Required Properties
                     //      builder.Property(s => s.Name).IsRequired().HasMaxLength(255);
                     //      builder.Property(s => s.Address).HasMaxLength(500);
                     //      builder.Property(s => s.Slug).HasMaxLength(255);
                     //      builder.Property(s => s.PaymentMethodsSupported).HasMaxLength(255);
                     //      builder.Property(s => s.Description).HasMaxLength(1000);
                     //      builder.Property(s => s.AccessInstructions).HasMaxLength(1000);
                     //      builder.Property(s => s.HouseRules).HasMaxLength(1000);

                     // Configure Enum to string conversion
                     builder.Property(s => s.Type).HasConversion<string>();
                     builder.Property(s => s.Status).HasConversion<string>();

                     // Configure Unique Constraint for Slug
                     //      builder.HasIndex(s => s.Slug).IsUnique();

                     // Configure Relationships

                     // Many-to-One relationship to User (Creator)
                     builder.HasOne(s => s.CreatedByUser)
                            .WithMany(u => u.CreatedSpaces)
                            .HasForeignKey(s => s.CreatedByUserId)
                            .IsRequired()
                            .OnDelete(DeleteBehavior.Restrict);

                     // Many-to-One relationship to User (Last Editor) - Optional
                     // builder.HasOne(s => s.LastEditedByUser)
                     //        .WithMany(u => u.LastEditedSpaces)
                     //        .HasForeignKey(s => s.LastEditedByUserId)
                     //        .IsRequired(false)
                     //        .OnDelete(DeleteBehavior.Restrict);

                     // Many-to-One relationship to OwnerProfile
                     builder.HasOne(s => s.OwnerProfile)
                            .WithMany(op => op.OwnedSpaces)
                            .HasForeignKey(s => s.OwnerProfileId)
                            .IsRequired()
                            .OnDelete(DeleteBehavior.Cascade); // Consider the onDelete behavior

                     // One-to-Many relationships
                     builder.HasMany(s => s.SpaceImages)
                            .WithOne(si => si.Space)
                            .HasForeignKey(si => si.SpaceId)
                            .OnDelete(DeleteBehavior.Cascade);

                     builder.HasMany(s => s.Bookings)
                            .WithOne(b => b.Space)
                            .HasForeignKey(b => b.SpaceId)
                            .OnDelete(DeleteBehavior.Cascade);

                     //      builder.HasMany(s => s.Reviews)
                     //             .WithOne(r => r.Space)
                     //             .HasForeignKey(r => r.SpaceId)
                     //             .OnDelete(DeleteBehavior.Cascade);

                     //      builder.HasMany(s => s.DamageReports)
                     //             .WithOne(dr => dr.Space)
                     //             .HasForeignKey(dr => dr.SpaceId)
                     //             .OnDelete(DeleteBehavior.Cascade);

                     //      builder.HasMany(s => s.Policies)
                     //             .WithOne(bp => bp.Space)
                     //             .HasForeignKey(bp => bp.SpaceId)
                     //             .OnDelete(DeleteBehavior.Cascade);

                     //      builder.HasMany(s => s.ReportsOnThisSpace)
                     //             .WithOne(r => r.ReportedSpace)
                     //             .HasForeignKey(r => r.ReportedSpaceId)
                     //             .IsRequired(false)
                     //             .OnDelete(DeleteBehavior.Restrict);

                     // Many-to-Many relationships (configured in separate configurations if using explicit join entities)
                     // Example for SpaceAmenity:
                     builder.HasMany(s => s.SpaceAmenities)
                            .WithOne(sa => sa.Space)
                            .HasForeignKey(sa => sa.SpaceId)
                            .OnDelete(DeleteBehavior.Cascade);

                     // Example for SpaceService:
                     builder.HasMany(s => s.ServiceSpaces)
                            .WithOne(ss => ss.Space)
                            .HasForeignKey(ss => ss.SpaceId)
                            .OnDelete(DeleteBehavior.Cascade);
              }
       }
}