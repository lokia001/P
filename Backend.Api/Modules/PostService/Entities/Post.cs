// Backend.Api/Modules/PostService/Entities/Post.cs

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

// --- Usings for related entities ---
using Backend.Api.Modules.CommunityService.Entities; // Cho Community
using Backend.Api.Modules.UserService.Entities; // Cho User
using Backend.Api.Modules.CommentService.Entities; // Cho Comment
using Backend.Api.Modules.ReportService.Entities;
using Backend.Api.Modules.ReactionService.Entities; // Cho Report

namespace Backend.Api.Modules.PostService.Entities
{
    public class Post
    {
        #region Basic Properties

        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        // Slug is required and unique within a Community (configured in DbContext)
        [Required]
        public string Slug { get; set; } = string.Empty;

        public string? Content { get; set; } // Nội dung bài viết

        public int Upvotes { get; set; } = 0; // Số lượt Upvote
        public int Downvotes { get; set; } = 0; // Số lượt Downvote

        public int CommentCount { get; set; } = 0; // Số lượng Comment (thường là computed/denormalized)

        public bool IsPinned { get; set; } = false; // Ghim bài viết lên đầu
        public bool IsEdited { get; set; } = false; // Đã chỉnh sửa

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        #endregion

        #region Foreign Keys

        [Required]
        public Guid CommunityId { get; set; } // FK trỏ đến Community chứa bài viết

        [Required]
        public Guid UserId { get; set; }       // FK trỏ đến User tạo bài viết (Author)

        #endregion

        #region Navigation Properties

        // Many-to-One relationship to Community
        public Community Community { get; set; } = default!;

        // Many-to-One relationship to User (Author)
        public User User { get; set; } = default!;

        // One-to-Many relationship to Comments
        public ICollection<Comment> Comments { get; set; } = new List<Comment>(); // Bài viết có nhiều Comment

        // One-to-Many relationship to Reports on this post
        // Post này có NHIỀU Reports trỏ về nó (báo cáo về Post này)
        public ICollection<Report>? ReportsOnThisPost { get; set; } = new List<Report>();
        public ICollection<Reaction>? Reactions { get; set; } = new List<Reaction>();
        #endregion
    }
}