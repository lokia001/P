// // Backend.Api/Modules/SpaceService/Configurations/SpaceDamageReportConfiguration.cs
// using Backend.Api.Modules.SpaceService.Entities;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// namespace Backend.Api.Modules.SpaceService.Configurations
// {
//     public class SpaceDamageReportConfiguration : IEntityTypeConfiguration<SpaceDamageReport>
//     {
//         public void Configure(EntityTypeBuilder<SpaceDamageReport> builder)
//         {
//             #region Table Configuration

//             builder.ToTable("SpaceDamageReports"); // Optional: Specify table name

//             builder.HasKey(sdr => sdr.Id); // Configure primary key

//             #endregion

//             #region Property Configurations

//             builder.Property(sdr => sdr.ReportedAt)
//                 .IsRequired()
//                 .HasDefaultValueSql("GETUTCDATE()"); // Example: Default value for reported time

//             builder.Property(sdr => sdr.Description)
//                 .IsRequired()
//                 .HasMaxLength(1000);

//             builder.Property(sdr => sdr.PhotoUrl)
//                 .HasMaxLength(255); // Example: Limit photo URL length

//             builder.Property(sdr => sdr.Status)
//                 .IsRequired()
//                 .HasConversion<string>(); // Store enum as string in the database

//             builder.Property(sdr => sdr.EstimatedCost)
//                 .HasColumnType("decimal(18,2)");

//             builder.Property(sdr => sdr.ActualCost)
//                 .HasColumnType("decimal(18,2)");

//             builder.Property(sdr => sdr.ResolutionNotes)
//                 .HasMaxLength(1000);

//             #endregion

//             #region Relationship Configurations

//             // Relationship with Space
//             builder.HasOne(sdr => sdr.Space)
//                 .WithMany(s => s.DamageReports) // Assuming Space entity has a collection navigation property DamageReports
//                 .HasForeignKey(sdr => sdr.SpaceId)
//                 .OnDelete(DeleteBehavior.Cascade); // Example: Delete related reports if a Space is deleted

//             // Optional relationship with Booking
//             builder.HasOne(sdr => sdr.Booking)
//                 .WithMany(b => b.DamageReports) // Assuming Booking entity has a collection navigation property DamageReports
//                 .HasForeignKey(sdr => sdr.BookingId)
//                 .OnDelete(DeleteBehavior.SetNull) // Example: Set BookingId to null if a Booking is deleted
//                 .IsRequired(false); // BookingId is nullable

//             // Relationship with ReportedByUser (User who reported)
//             builder.HasOne(sdr => sdr.ReportedByUser)
//                 .WithMany(u => u.ReportedDamageReports) // Assuming User entity has a collection navigation property ReportedDamageReports
//                 .HasForeignKey(sdr => sdr.ReportedByUserId)
//                 .OnDelete(DeleteBehavior.Restrict); // Example: Prevent deleting a User if they have reported damage

//             // Optional relationship with ResolvedByUser (User who resolved)
//             builder.HasOne(sdr => sdr.ResolvedByUser)
//                 .WithMany(u => u.ResolvedDamageReports) // Assuming User entity has a collection navigation property ResolvedDamageReports
//                 .HasForeignKey(sdr => sdr.ResolvedByUserId)
//                 .OnDelete(DeleteBehavior.SetNull) // Example: Set ResolvedByUserId to null if the resolver User is deleted
//                 .IsRequired(false); // ResolvedByUserId is nullable

//             // Optional relationship with ExtraCharge (if you uncommented it in the entity)
//             // builder.HasOne(sdr => sdr.ExtraCharge)
//             //     .WithOne(ec => ec.SpaceDamageReport)
//             //     .HasForeignKey<SpaceDamageReport>(sdr => sdr.ExtraChargeId)
//             //     .OnDelete(DeleteBehavior.SetNull)
//             //     .IsRequired(false);

//             #endregion
//         }
//     }
// }