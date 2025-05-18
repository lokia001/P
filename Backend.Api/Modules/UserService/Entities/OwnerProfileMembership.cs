// Backend.Api/Modules/UserService/Entities/OwnerProfileMembership.cs

using System;
using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema; // Chỉ cần nếu dùng [Column] hoặc [DatabaseGenerated]

// --- Usings for related entities ---
// Include Usings for User and OwnerProfile
using Backend.Api.Modules.UserService.Entities;

namespace Backend.Api.Modules.UserService.Entities
{
    // --- Enum for Role within OwnerProfile ---
    public enum OwnerProfileRole
    {
        PrimaryContact,
        Manager,
        Editor,
        Reporter,
        Admin
    }

    // Join Entity for Many-to-Many relationship between OwnerProfile and User (Members)
    public class OwnerProfileMembership
    {
        #region Basic Properties

        [Key]
        public Guid Id { get; set; }

        public OwnerProfileRole Role { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        #endregion

        #region Foreign Keys

        [Required]
        public Guid OwnerProfileId { get; set; } // FK to the OwnerProfile

        [Required]
        public Guid UserId { get; set; } // FK to the User (the member)

        // Optional FK: Track who made this assignment
        public Guid? AssignedByUserId { get; set; } // FK to the User (Admin/Owner)

        #endregion

        #region Navigation Properties

        // Many-to-One relationship back to OwnerProfile
        public OwnerProfile OwnerProfile { get; set; } = default!;

        // Many-to-One relationship back to User (the member)
        public User User { get; set; } = default!;

        // Optional Many-to-One relationship back to the assigning User
        public User? AssignedByUser { get; set; }

        #endregion
    }
}