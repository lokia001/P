// Backend.Api/Modules/CommentService/Entities/Comment.cs

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

// --- Usings for related entities ---
using Backend.Api.Modules.PostService.Entities; // Cho Post
using Backend.Api.Modules.ReactionService.Entities;
using Backend.Api.Modules.ReportService.Entities; // Cho Report
using Backend.Api.Modules.UserService.Entities; // Cho User

namespace Backend.Api.Modules.CommentService.Entities
{
    public class Comment
    {
        #region Basic Properties

        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Content { get; set; } = string.Empty;

        public int Upvotes { get; set; } = 0;
        public int Downvotes { get; set; } = 0;

        public bool IsEdited { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        #endregion

        #region Foreign Keys

        [Required]
        public Guid PostId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public Guid? ParentCommentId { get; set; } // FK cho mối quan hệ tự tham chiếu (Comment cha)

        #endregion

        #region Navigation Properties

        // Many-to-One relationship to Post
        public Post Post { get; set; } = default!;

        // Many-to-One relationship to User (Author)
        public User User { get; set; } = default!;

        // Many-to-One relationship to Parent Comment (Self-referencing)
        public Comment? ParentComment { get; set; }

        // One-to-Many relationship to Replies (Self-referencing)
        public ICollection<Comment> Replies { get; set; } = new List<Comment>();

        // One-to-Many relationship to Reports on this comment
        public ICollection<Report>? ReportsOnThisComment { get; set; } = new List<Report>();
        public ICollection<Reaction>? Reactions { get; set; } = new List<Reaction>();
        #endregion
    }
}