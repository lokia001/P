// Backend.Api/Modules/UserService/Entities/OwnerProfile.cs

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Api.Modules.BookingService.Entities;


// --- Usings for related entities ---
// Chỉ include entity Space vì OwnerProfile có Nav Property Spaces
using Backend.Api.Modules.SpaceService.Entities;

namespace Backend.Api.Modules.UserService.Entities
{
    public class OwnerProfile
    {
        #region Basic Properties

        // Primary Key, also FK to User for 1-0/1 relationship
        [Key]
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [Required]
        public string CompanyName { get; set; } = string.Empty;

        public string? ContactInfo { get; set; }
        public string? AdditionalInfo { get; set; }

        public string? BusinessLicenseNumber { get; set; }
        public string? TaxCode { get; set; }
        public string? Website { get; set; }
        public string? LogoUrl { get; set; }

        public bool IsVerified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        #endregion

        #region Navigation Properties

        // 1-0/1 relationship with User (Primary Owner)
        public User User { get; set; } = default!;

        // 1-N relationship with Space
        public ICollection<Space>? OwnedSpaces { get; set; }

        // 1-N relationship with OwnerProfileMembership (Join Entity for N-N with User - Members)
        // public ICollection<OwnerProfileMembership>? Memberships { get; set; }
        // public ICollection<BookingPolicy>? Policies { get; set; }

        // Optional: If Services are tied directly to OwnerProfile
        // public ICollection<Service>? OfferedServices { get; set; } // Cần thêm ICollection<Service>? OfferedServices vào OwnerProfile

        #endregion
    }
}