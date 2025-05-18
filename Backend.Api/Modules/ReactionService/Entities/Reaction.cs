// Backend.Api/Modules/ReactionService/Entities/Reaction.cs

using System;
using System.ComponentModel.DataAnnotations;

// --- Usings for related entities ---
using Backend.Api.Modules.UserService.Entities; // Cho User
// Cần using cho Post và Comment
using Backend.Api.Modules.PostService.Entities; // Cho Post
using Backend.Api.Modules.CommentService.Entities; // Cho Comment


namespace Backend.Api.Modules.ReactionService.Entities
{
    #region Enums

    // Enum ReactionTargetType không còn cần thiết trong entity Reaction nữa
    // vì kiểu đích được xác định bằng FK và Nav Prop

    // Loại Reaction cụ thể (Like, Dislike, v.v.)
    public enum ReactionType
    {
        Like,
        Dislike
        // Thêm các loại reaction khác nếu cần
    }

    #endregion

    // Represents a reaction (like, dislike, etc.) given by a User to a Post or Comment
    public class Reaction
    {
        #region Basic Properties

        [Key]
        public Guid Id { get; set; }

        [Required] // Đảm bảo luôn có loại Reaction
        public ReactionType ReactionType { get; set; } // Loại Reaction cụ thể

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        #endregion

        #region Foreign Keys

        [Required]
        public Guid UserId { get; set; } // FK trỏ đến User tạo Reaction

        // --- BỔ SUNG: Các FK có thể null trỏ đến Post hoặc Comment ---
        public Guid? PostId { get; set; } // FK trỏ đến Post (nếu Reaction cho Post)
        public Guid? CommentId { get; set; } // FK trỏ đến Comment (nếu Reaction cho Comment)

        // LƯU Ý QUAN TRỌNG: Logic ứng dụng HOẶC ràng buộc database (check constraint)
        // cần đảm bảo chỉ MỘT trong hai trường PostId HOẶC CommentId có giá trị khác NULL.

        #endregion

        #region Navigation Properties

        // Many-to-One relationship to User (Reactor)
        public User User { get; set; } = default!;

        // --- BỔ SUNG: Navigation Property tùy chọn đến Post và Comment ---
        // Reaction trỏ đến Post (nếu PostId có giá trị)
        public Post? Post { get; set; }

        // Reaction trỏ đến Comment (nếu CommentId có giá trị)
        public Comment? Comment { get; set; }

        #endregion
    }
}