// // Backend.Api/Modules/ReviewService/Configurations/ReviewConfiguration.cs
// using Backend.Api.Modules.ReviewService.Entities;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;

// namespace Backend.Api.Modules.ReviewService.Configurations
// {
//     public class ReviewConfiguration : IEntityTypeConfiguration<Review>
//     {
//         public void Configure(EntityTypeBuilder<Review> builder)
//         {
//             #region Table Configuration

//             builder.ToTable("Reviews"); // Optional: Specify table name

//             builder.HasKey(r => r.Id); // Configure primary key

//             #endregion

//             #region Property Configurations

//             builder.Property(r => r.Rating)
//                 .IsRequired()
//                 .HasColumnType("int")
//                 .HasMaxLength(1); // Assuming rating is a single digit (1-5)

//             builder.Property(r => r.Comment)
//                 .IsRequired()
//                 .HasColumnType("nvarchar(max)"); // Allows for longer review comments

//             builder.Property(r => r.CreatedAt)
//                 .IsRequired()
//                 .HasDefaultValueSql("GETUTCDATE()"); // Example: Default value for creation time

//             builder.Property(r => r.Status)
//                 .IsRequired()
//                 .HasConversion<string>(); // Store enum as string

//             builder.Property(r => r.ModeratorNotes)
//                 .HasColumnType("nvarchar(max)"); // Allows for longer moderator notes

//             #endregion

//             #region Relationship Configurations

//             // Relationship with Booking
//             builder.HasOne(r => r.Booking)
//                 .WithMany(b => b.Reviews) // Assuming Booking entity has a collection navigation property Reviews
//                 .HasForeignKey(r => r.BookingId)
//                 .OnDelete(DeleteBehavior.Cascade); // Example: Delete reviews if the associated booking is deleted

//             // Relationship with User (Reviewer)
//             builder.HasOne(r => r.User)
//                 .WithMany(u => u.SubmittedReviews) // Assuming User entity has a collection navigation property SubmittedReviews
//                 .HasForeignKey(r => r.UserId)
//                 .OnDelete(DeleteBehavior.Restrict); // Example: Prevent deleting a user if they have submitted reviews

//             // Optional relationship with ModeratedByUser (Moderator)
//             builder.HasOne(r => r.ModeratedByUser)
//                 .WithMany(u => u.ModeratedReviews) // Assuming User entity has a collection navigation property ModeratedReviews
//                 .HasForeignKey(r => r.ModeratedByUserId)
//                 .OnDelete(DeleteBehavior.SetNull) // Example: Set ModeratedByUserId to null if the moderator user is deleted
//                 .IsRequired(false); // ModeratedByUserId is nullable

//             #endregion
//         }
//     }
// }