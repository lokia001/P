// Backend.Api/Modules/CommunityService/Entities/CommunityMember.cs

using System;
using System.ComponentModel.DataAnnotations;

// --- Usings for related entities ---
using Backend.Api.Modules.UserService.Entities; // Cho User
// Community ở cùng Namespace nên không cần using riêng
// Cần thêm using cho CommunityPolicy
using Backend.Api.Modules.CommunityService.Entities; // CommunityPolicy ở cùng Namespace

namespace Backend.Api.Modules.CommunityService.Entities
{
    // --- Enum for Role within Community ---
    public enum CommunityRole
    {
        Member,
        CommunityOwner,
        Moderator
    }

    // Join Entity for Many-to-Many relationship between Community and User (Members)
    public class CommunityMember
    {
        #region Basic Properties

        [Key]
        public Guid Id { get; set; }

        public CommunityRole Role { get; set; }

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        // --- Acceptance Tracking ---
        public bool HasAgreedToRules { get; set; } = false;
        public DateTime? AgreedAt { get; set; }

        // --- Link to the specific Policy version agreed to ---
        public Guid? AgreedPolicyId { get; set; } // FK trỏ đến CommunityPolicy (có thể null nếu chưa đồng ý)
        public CommunityPolicy? AgreedPolicy { get; set; } // Nav Property trỏ đến phiên bản Policy đã đồng ý

        #endregion

        #region Foreign Keys

        [Required]
        public Guid CommunityId { get; set; } // FK to the Community

        [Required]
        public Guid UserId { get; set; } // FK to the User (the member)

        #endregion

        #region Navigation Properties

        // Many-to-One relationship back to Community
        public Community Community { get; set; } = default!;

        // Many-to-One relationship back to User (the member)
        public User User { get; set; } = default!;

        #endregion
    }
}