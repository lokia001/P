// // Backend.Api/Modules/PaymentService/Configurations/PaymentConfiguration.cs
// using Backend.Api.Modules.PaymentService.Entities;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// namespace Backend.Api.Modules.PaymentService.Configurations
// {
//     public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
//     {
//         public void Configure(EntityTypeBuilder<Payment> builder)
//         {
//             #region Table Configuration

//             builder.ToTable("Payments"); // Optional: Specify table name

//             builder.HasKey(p => p.Id); // Configure primary key

//             #endregion

//             #region Property Configurations

//             builder.Property(p => p.Amount)
//                 .IsRequired()
//                 .HasColumnType("decimal(18,2)");

//             builder.Property(p => p.PaymentMethod)
//                 .IsRequired()
//                 .HasConversion<string>(); // Store enum as string

//             builder.Property(p => p.PaymentStatus)
//                 .IsRequired()
//                 .HasConversion<string>(); // Store enum as string

//             builder.Property(p => p.CreatedAt)
//                 .IsRequired()
//                 .HasDefaultValueSql("GETUTCDATE()"); // Example: Default value for creation time

//             builder.Property(p => p.TransactionId)
//                 .HasMaxLength(255);

//             builder.Property(p => p.GatewayPaymentId)
//                 .HasMaxLength(255);

//             // You might want to configure GatewayResponse as a larger text field
//             // depending on the potential size of the response.
//             builder.Property(p => p.GatewayResponse)
//                 .HasColumnType("nvarchar(max)"); // Example for larger text

//             #endregion

//             #region Relationship Configurations

//             // Relationship with Booking
//             builder.HasOne(p => p.Booking)
//                 .WithMany(b => b.Payments) // Assuming Booking entity has a collection navigation property Payments
//                 .HasForeignKey(p => p.BookingId)
//                 .OnDelete(DeleteBehavior.Cascade); // Example: Delete payments if the associated booking is deleted

//             #endregion

//             #region Optional Polymorphic Relationship Configuration (Commented Out)

//             // If you uncomment the polymorphic relationship in the entity,
//             // you would need to configure it here. This is a more advanced
//             // scenario and depends heavily on your specific requirements.
//             // Example (very basic and might need adjustments):
//             // builder.Property(p => p.TargetEntityType)
//             //     .HasMaxLength(100);
//             // builder.HasIndex(p => new { p.TargetEntityId, p.TargetEntityType });

//             #endregion
//         }
//     }
// }