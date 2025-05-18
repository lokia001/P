// Backend.Api/Modules/ReportService/Entities/Report.cs

using System;
using System.ComponentModel.DataAnnotations;

// --- Usings for related entities ---
using Backend.Api.Modules.UserService.Entities; // Cho User
// Cần usings cho tất cả các entity có thể bị báo cáo
using Backend.Api.Modules.PostService.Entities;     // Cho Post
using Backend.Api.Modules.CommentService.Entities;  // Cho Comment
using Backend.Api.Modules.SpaceService.Entities;    // Cho Space (nếu Space có thể bị báo cáo)
using Backend.Api.Modules.CommunityService.Entities; // Cho Community (nếu Community có thể bị báo cáo)


namespace Backend.Api.Modules.ReportService.Entities
{
    #region Enums

    // Enum ReportedTargetType không còn cần thiết trong entity Report nữa
    // vì kiểu đích được xác định bằng việc FK nào có giá trị

    // Common reasons for reporting content or users
    public enum ReportReason
    {
        Spam,
        Harassment,
        InappropriateContent,
        NudityOrSexuality,
        HateSpeech,
        Misinformation,
        Other
    }

    // Status of the report workflow
    public enum ReportStatus
    {
        Pending,        // Chờ xem xét
        UnderReview,    // Đang được người kiểm duyệt xem xét
        ActionTaken,    // Đã thực hiện hành động
        NoActionNeeded, // Không cần hành động
        Closed          // Đã giải quyết
    }

    #endregion

    // Represents a report submitted by a User against content or another User
    public class Report
    {
        #region Basic Properties

        [Key]
        public Guid Id { get; set; } // Primary Key

        [Required] // Đảm bảo luôn có lý do báo cáo
        public ReportReason Reason { get; set; } // Lý do chính

        [StringLength(500)]
        public string? CustomReason { get; set; } // Mô tả thêm nếu lý do là 'Other'

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Thời điểm báo cáo được gửi

        #endregion

        #region Workflow/Moderation Properties

        [Required] // Status là bắt buộc, mặc định Pending
        public ReportStatus Status { get; set; } = ReportStatus.Pending; // Trạng thái hiện tại

        public Guid? ReviewedByUserId { get; set; } // FK đến User (Admin/Moderator) đã xem xét
        public DateTime? ReviewedAt { get; set; } // Thời điểm xem xét

        [StringLength(1000)]
        public string? ResolutionNotes { get; set; } // Ghi chú từ người kiểm duyệt

        #endregion

        #region Foreign Keys

        // *** Relationship: Report (Many) -> User (One) - The Reporter ***
        [Required]
        public Guid ReporterUserId { get; set; } // FK đến User đã gửi báo cáo

        // --- BỔ SUNG: Các FK có thể null trỏ đến đối tượng bị báo cáo ---
        public Guid? ReportedPostId { get; set; } // FK trỏ đến Post (nếu báo cáo Post)
        public Guid? ReportedCommentId { get; set; } // FK trỏ đến Comment (nếu báo cáo Comment)
        public Guid? ReportedUserId { get; set; } // FK trỏ đến User bị báo cáo (nếu báo cáo User)
        public Guid? ReportedSpaceId { get; set; } // FK trỏ đến Space (nếu báo cáo Space)
        public Guid? ReportedCommunityId { get; set; } // FK trỏ đến Community (nếu báo cáo Community)

        // LƯU Ý QUAN TRỌNG: Logic ứng dụng HOẶC ràng buộc database (check constraint)
        // cần đảm bảo chỉ MỘT TRONG CÁC trường FK Reported...Id có giá trị khác NULL.

        #endregion

        #region Navigation Properties

        // Navigation Property trỏ đến User đã gửi báo cáo (Reporter)
        public User ReporterUser { get; set; } = default!;

        // Navigation Property trỏ đến User (Admin/Moderator) đã xem xét (Reviewer)
        public User? ReviewedByUser { get; set; }

        // --- BỔ SUNG: Navigation Property tùy chọn đến đối tượng bị báo cáo ---
        public Post? ReportedPost { get; set; } // Report trỏ đến Post
        public Comment? ReportedComment { get; set; } // Report trỏ đến Comment
        public User? ReportedUser { get; set; } // Report trỏ đến User bị báo cáo
        public Space? ReportedSpace { get; set; } // Report trỏ đến Space
        public Community? ReportedCommunity { get; set; } // Report trỏ đến Community

        #endregion
    }
}