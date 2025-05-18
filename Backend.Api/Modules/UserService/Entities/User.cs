// Backend.Api/Modules/UserService/Entities/User.cs

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema; // Chỉ cần nếu dùng [Column] hoặc [DatabaseGenerated]

// --- Usings for related entities with active Navigation Properties ---
// Chỉ include những entity thực sự có Navigation Property không bị comment trong class này
using Backend.Api.Modules.BookingService.Entities; // Cho Booking, BookingExtraCharge, BookingServiceItem
using Backend.Api.Modules.ReviewService.Entities;
using Backend.Api.Modules.ReactionService.Entities;
using Backend.Api.Modules.CommunityService.Entities;
using Backend.Api.Modules.SpaceService.Entities; // Cho Space
using Backend.Api.Modules.ReportService.Entities;
using Backend.Api.Modules.PostService.Entities;
using Backend.Api.Modules.CommentService.Entities;
// using Backend.Api.Modules.PaymentService.Entities; // Không còn Navigation Property Payment

namespace Backend.Api.Modules.UserService.Entities
{
    // --- Enums (Có thể tách ra file riêng nếu dùng chung nhiều nơi) ---
    public enum Role
    {
        User,
        Owner,
        Admin,
        Moderator,
        SysAdmin
    }

    public enum Gender
    {
        Male,
        Female,
        Other,
        Unknown
    }

    public class User
    {
        #region Basic Properties

        [Key]
        public Guid Id { get; set; }

        // [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public string? Bio { get; set; }

        public string? PhoneNumber { get; set; }

        [Required]
        public Role Role { get; set; } = Role.User;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        #endregion

        // #region Profile Information

        public DateTime? DateOfBirth { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        public Gender Gender { get; set; } = Gender.Unknown;

        [MaxLength(255)]
        public string? Address { get; set; }

        public string? AvatarUrl { get; set; }

        // #endregion

        // #region Security Related Fields

        // public int FailedLoginAttempts { get; set; } = 0;

        // public DateTime? AccountLockoutEnd { get; set; }

        // public string? RefreshToken { get; set; }

        // public DateTime? RefreshTokenExpiry { get; set; }

        // #endregion

        // --- Navigation Properties ---

        #region Relationships with OwnerProfile (1-0/1 and N-N via Join)

        public OwnerProfile? OwnerProfile { get; set; } // User (One) -> OwnerProfile (Zero or One)

        // public ICollection<OwnerProfileMembership>? OwnerProfileMemberships { get; set; } // User <-> OwnerProfile (N-N via Join)

        #endregion

        #region Relationships with Space

        public ICollection<Space>? CreatedSpaces { get; set; } // User (One) -> Space (Many) - Creator

        public ICollection<Space>? LastEditedSpaces { get; set; } // User (One) -> Space (Many) - LastEditedBy

        #endregion

        #region Relationships with Booking

        public ICollection<Booking>? Bookings { get; set; } // User (One) -> Booking (Many) - Booker

        #endregion

        // #region Relationships with Review

        // public ICollection<Review>? Reviews { get; set; } // User (One) -> Review (Many) - Reviewer

        // #endregion

        // #region Relationships with Reaction

        // public ICollection<Reaction>? Reactions { get; set; } // User (One) -> Reaction (Many) - Reactor

        // #endregion

        // #region Relationships with Community

        // public ICollection<CommunityMember>? CommunityMembers { get; set; } // User <-> Community (N-N via Join)

        // public ICollection<Community>? CreatedCommunities { get; set; } // User (One) -> Community (Many) - Creator

        // #endregion

        // #region Relationships with Post

        // public ICollection<Post>? Posts { get; set; } // User (One) -> Post (Many) - Author

        // #endregion

        // #region Relationships with Comment

        // public ICollection<Comment>? Comments { get; set; } // User (One) -> Comment (Many) - Author

        // #endregion

        // #region Relationships with Report

        // public ICollection<Report>? SubmittedReports { get; set; } // User (One) -> Report (Many) - Reporter

        // public ICollection<Report>? ReviewedReports { get; set; } // User (One) -> Report (Many) - Reviewer

        // #endregion

        // #region Extended Relationships (Now active)

        // // User (One) -> SpaceDamageReport (Many) - Reporter
        // public ICollection<SpaceDamageReport>? ReportedDamages { get; set; } // User này đã gửi NHIỀU báo cáo thiệt hại

        // // User (One) -> SpaceDamageReport (Many) - Resolver
        // public ICollection<SpaceDamageReport>? ResolvedDamages { get; set; } // User này đã xử lý (review/giải quyết) NHIỀU báo cáo thiệt hại

        // // User (One) -> BookingExtraCharge (Many) - Creator/AssignedBy
        // public ICollection<BookingExtraCharge>? CreatedExtraCharges { get; set; } // User này đã tạo NHIỀU khoản phí phát sinh

        // // User (One) -> BookingServiceItem (Many) - AddedBy
        // public ICollection<BookingServiceItem>? AddedServiceItems { get; set; } // User này đã thêm NHIỀU mục dịch vụ vào booking
        // public ICollection<OwnerProfileMembership>? AssignedMemberships { get; set; }

        // public ICollection<Report>? ReportsOnThisUser { get; set; } = new List<Report>();
        // #endregion
    }
}