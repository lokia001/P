// Backend.Api/Modules/BookingService/Entities/Booking.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Api.Modules.UserService.Entities;
// using Backend.Api.Modules.ReactionService.Entities; // Only if reactions are directly on Booking
using Backend.Api.Modules.PaymentService.Entities; // For Payment entity (N-1 relationship)
using Backend.Api.Modules.SpaceService.Entities;
using Backend.Api.Modules.ReviewService.Entities; // For Review entity (1-N relationship)
using Backend.Api.Modules.BookingService.Entities; // For BookingExtraCharge, BookingServiceItem (1-N relationships)


namespace Backend.Api.Modules.BookingService.Entities
{
    public enum BookingStatus
    {
        Pending,
        Confirmed,
        CheckedIn, // Added: Status when customer has physically checked in
        Completed, // Finished, ActualCheckOut recorded
        Overdue,   // EndDateTime passed, but not CheckedIn/Completed/Cancelled/NoShow
        NoShow,    // Customer did not check in
        Cancelled, // Booking was cancelled
        Abandoned  // Booking process started but not completed (e.g., payment failed)
    }

    // Represents a booking made by a User for a specific Space
    public class Booking
    {
        [Key]
        public Guid Id { get; set; } // Primary Key

        // *** Relationship: Booking (Many) -> User (One) - The Booker (and default Representative/Onsite Contact) ***
        [Required]
        public Guid UserId { get; set; } // FK to User who made the booking
        // Navigation Property should be NON-NULLABLE as FK is [Required]
        public User User { get; set; } = default!; // Navigation Property to the booking User

        // *** Relationship: Booking (Many) -> Space (One) - The booked Space ***
        [Required]
        public Guid SpaceId { get; set; } // FK to the booked Space
        // Navigation Property should be NON-NULLABLE as FK is [Required]
        public Space Space { get; set; } = default!; // Navigation Property to the booked Space

        // *** Booking Timeframe ***
        [Required]
        public DateTime StartDateTime { get; set; } // Expected booking start time
        [Required]
        public DateTime EndDateTime { get; set; } // Expected booking end time

        // *** Actual Usage Timeframe ***
        // Recorded during check-in/check-out process
        public DateTime? ActualCheckIn { get; set; } // Actual check-in time (Nullable)
        public DateTime? ActualCheckOut { get; set; } // Actual check-out time (Nullable)


        public bool IsDeleted { get; set; } = false; // Soft delete flag

        // *** Booking Details ***
        [StringLength(20)]
        public string? BookingCode { get; set; } // Optional unique code for easy lookup (needs UNIQUE constraint)

        [StringLength(500)]
        public string? Note { get; set; } // Optional notes for the booking

        [Range(1, 100)] // Assuming 1 to 100 people (adjust range as needed)
        public int NumPeople { get; set; } // Number of people for the booking (1 for individual, >1 for group)

        public BookingStatus BookingStatus { get; set; } = BookingStatus.Pending; // Current booking status

        // *** Calculated/Summary Fields (Optional - can be calculated via queries) ***
        // [Column(TypeName = "decimal(18,2)")]
        // public decimal? TotalAmount { get; set; } // Total calculated amount including extras

        // *** Audit Fields ***
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp of booking record creation
        public DateTime? UpdatedAt { get; set; } // Timestamp of last booking record update

        // --- Navigation Properties (Relationships where Booking is on the "One" side) ---

        // Relationship: Booking (One) -> Payment (Many) - One booking can have multiple payment records
        // (If Payment entity has FK BookingId trỏ về đây, which your Payment entity does)
        // public ICollection<Payment>? Payments { get; set; } // Payment records related to this booking

        // Relationship: Booking (One) -> Review (Many) - One booking can have multiple reviews (though typically one per user)
        // (If Review entity has FK BookingId trỏ về đây)
        // public ICollection<Review>? Reviews { get; set; } // Reviews submitted for this booking

        // --- Navigation Properties for New/Extended Entities (Optional/Extended) ---

        // Relationship: Booking (One) -> BookingExtraCharge (Many) - One booking can have multiple extra charges/adjustments
        // public ICollection<BookingExtraCharge>? ExtraCharges { get; set; } // Extra charges/adjustments for this booking

        // Relationship: Booking (One) -> SpaceDamageReport (Many) - One booking can have multiple damage reports linked
        // public ICollection<SpaceDamageReport>? DamageReports { get; set; } // Damage reports linked to this booking

        // Relationship: Booking (One) -> BookingServiceItem (Many) - One booking can have multiple specific service items used
        // public ICollection<BookingServiceItem>? ServiceItems { get; set; } // Specific services consumed during this booking

    }
}