// Backend.Api/Modules/CommunityService/Entities/CommunityPolicy.cs

using System;
using System.ComponentModel.DataAnnotations;
// using System.ComponentModel.DataAnnotations.Schema; // Cần nếu dùng Column/DatabaseGenerated

// --- Usings for related entities ---
// Include Community since Policy belongs to a Community
using Backend.Api.Modules.CommunityService.Entities;

namespace Backend.Api.Modules.CommunityService.Entities
{
    // Represents a specific version of the rules/policy for a Community
    public class CommunityPolicy
    {
        #region Basic Properties

        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(255)] // Tên chính sách/phiên bản
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)] // Số phiên bản
        public string Version { get; set; } = string.Empty;

        [Required]
        // Use ColumnType("TEXT") if using SQLite/PostgreSQL for potentially large content
        // Or it will map to NVARCHAR(MAX) in SQL Server by default
        public string Content { get; set; } = string.Empty; // Nội dung đầy đủ của nội quy

        public DateTime EffectiveDate { get; set; } // Ngày có hiệu lực của phiên bản này

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true; // Cờ đánh dấu phiên bản hiện hành

        #endregion

        #region Foreign Key

        [Required]
        public Guid CommunityId { get; set; } // FK trỏ đến Community

        #endregion

        #region Navigation Properties

        // Many-to-One relationship back to Community
        public Community Community { get; set; } = default!;

        public ICollection<CommunityMember>? MembershipsAgreedToThisPolicy { get; set; }

        #endregion
    }
}