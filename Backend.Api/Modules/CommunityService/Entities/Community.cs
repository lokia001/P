// Backend.Api/Modules/CommunityService/Entities/Community.cs

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

// --- Usings for related entities ---
using Backend.Api.Modules.PostService.Entities; // Cho Post
using Backend.Api.Modules.ReportService.Entities;
using Backend.Api.Modules.UserService.Entities; // Cho User

namespace Backend.Api.Modules.CommunityService.Entities
{
    public class Community
    {
        #region Basic Properties

        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required] // Slug là bắt buộc như trong cấu hình Unique Index
        public string Slug { get; set; } = string.Empty; // Unique constraint configured in DbContext

        public string? Description { get; set; }

        public string? AvatarUrl { get; set; }

        public string? BannerUrl { get; set; }

        public bool IsPrivate { get; set; } = false;

        public bool IsArchived { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        #endregion

        #region Creator Relationship

        [Required] // Người tạo là bắt buộc như trong cấu hình DbContext
        public Guid CreatedByUserId { get; set; }
        public User CreatedBy { get; set; } = null!; // Navigation Property trỏ đến người tạo (CreatedBy)

        #endregion

        #region Navigation Properties
        public ICollection<CommunityPolicy>? Policies { get; set; }
        // 1-N relationship with CommunityMember (Join Entity for N-N with User)
        public ICollection<CommunityMember> CommunityMembers { get; set; } = new List<CommunityMember>();

        // 1-N relationship with Post
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Report>? ReportsOnThisCommunity { get; set; } = new List<Report>();
        #endregion
    }
}