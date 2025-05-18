// Backend.Api/Modules/SpaceService/Entities/Space.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Api.Modules.ReviewService.Entities;
using Backend.Api.Modules.BookingService.Entities;
using Backend.Api.Modules.UserService.Entities;
using Backend.Api.Modules.ServiceService.Entities;
using Backend.Api.Modules.ReportService.Entities;

namespace Backend.Api.Modules.SpaceService.Entities
{
    #region Enums

    public enum SpaceType
    {
        Individual,
        Group,
        MeetingRoom,
        EntireOffice
    }

    public enum SpaceStatus
    {
        Available,
        Booked,
        Maintenance
    }

    #endregion

    public class Space
    {
        #region Basic Properties

        [Key]
        public Guid Id { get; set; } // Primary Key

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
        public string? Address { get; set; }

        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }

        public SpaceType Type { get; set; }
        public SpaceStatus Status { get; set; }

        public int Capacity { get; set; }

        #endregion

        #region Pricing Properties

        [Column(TypeName = "decimal(18,2)")]
        public decimal BasePrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? HourlyPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DailyPrice { get; set; }

        #endregion

        #region Time & Booking Constraints

        public TimeSpan? OpenTime { get; set; }
        public TimeSpan? CloseTime { get; set; }

        public int CleaningDurationMinutes { get; set; } = 0; // Time needed for cleaning AFTER a booking
        public int BufferMinutes { get; set; } = 0; // Time buffer needed AFTER cleaning before the next booking starts

        public int MinBookingDurationMinutes { get; set; } = 30;
        public int MaxBookingDurationMinutes { get; set; } = 1440;
        public int CancellationNoticeHours { get; set; } = 24;

        #endregion

        #region Additional Information

        // public string? AccessInstructions { get; set; }
        // public string? HouseRules { get; set; }

        // public string? PaymentMethodsSupported { get; set; } // Maybe link to a separate PaymentMethod entity later

        // public double? AverageRating { get; set; } // Calculated field
        // public int TotalReviews { get; set; } // Calculated field

        // public string? Slug { get; set; }
        // Note: Needs a UNIQUE constraint configured (e.g., via Fluent API)

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        #endregion

        #region Foreign Keys

        // Relationship: Space (Many) -> User (One) - Creator
        [Required]
        public Guid CreatedByUserId { get; set; }

        // Relationship: Space (Many) -> User (One) - Last Editor
        public Guid? LastEditedByUserId { get; set; }

        // Relationship: Space (Many) -> OwnerProfile (One) - Ownership
        [Required]
        public Guid OwnerProfileId { get; set; }

        #endregion

        #region Navigation Properties

        public User CreatedByUser { get; set; } = default!;
        public User? LastEditedByUser { get; set; }
        public OwnerProfile OwnerProfile { get; set; } = default!;

        public ICollection<SpaceImage>? SpaceImages { get; set; } // A Space can have many images
        public ICollection<Booking>? Bookings { get; set; } // A Space can have many bookings
        // public ICollection<Review>? Reviews { get; set; } // A Space can have many reviews
        // public ICollection<SpaceDamageReport>? DamageReports { get; set; }
        public ICollection<SpaceAmenity>? SpaceAmenities { get; set; } // Example if using SpaceAmenity join
        public ICollection<ServiceSpace>? ServiceSpaces { get; set; } // Example if using SpaceService join

        // public ICollection<BookingPolicy>? Policies { get; set; }
        // public ICollection<Report>? ReportsOnThisSpace { get; set; } = new List<Report>();

        #endregion
    }
}