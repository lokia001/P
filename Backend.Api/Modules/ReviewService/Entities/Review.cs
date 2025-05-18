// Backend.Api/Modules/ReviewService/Entities/Review.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Api.Modules.UserService.Entities;
using Backend.Api.Modules.BookingService.Entities;

namespace Backend.Api.Modules.ReviewService.Entities
{
    // Optional: Status of the review for moderation
    public enum ReviewStatus
    {
        Pending,   // Waiting for moderation
        Published, // Visible to users
        Hidden     // Hidden (e.g., inappropriate content)
    }

    // Represents a review submitted by a User for a specific Booking
    public class Review
    {
        #region Properties

        [Key]
        public Guid Id { get; set; } // Primary Key

        [Required]
        [Range(1, 5)] // Assuming rating scale is 1 to 5
        public int Rating { get; set; } // The numerical rating given

        [Required] // Assuming comment text is required for a review
        public string Comment { get; set; } = string.Empty; // The review text

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp when the review was created

        #endregion

        #region Relationships

        // *** Relationship: Review (Many) -> Booking (One) ***
        // A review is submitted for a specific booking experience
        [Required]
        public Guid BookingId { get; set; } // FK to the Booking being reviewed
        [ForeignKey("BookingId")]
        public Booking Booking { get; set; } = default!; // Navigation Property to the Booking

        // *** Relationship: Review (Many) -> User (One) - The Reviewer ***
        [Required]
        public Guid UserId { get; set; } // FK to the User who wrote the review
        [ForeignKey("UserId")]
        public User User { get; set; } = default!; // Navigation Property to the User

        // >> Removed: SpaceId and Space Navigation Property. Space can be accessed via Review -> Booking -> Space.

        #endregion

        #region Moderation Details (Optional)

        public ReviewStatus Status { get; set; } = ReviewStatus.Pending; // Moderation status

        public Guid? ModeratedByUserId { get; set; } // FK to the User (Admin/Moderator) who reviewed this review (Nullable)
        [ForeignKey("ModeratedByUserId")]
        public User? ModeratedByUser { get; set; } // Optional Navigation Property

        public DateTime? ModeratedAt { get; set; } // Timestamp when the review was moderated (Nullable)

        public string? ModeratorNotes { get; set; } // Notes from the moderator (Optional)

        #endregion
    }
}