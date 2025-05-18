// Backend.Api/Modules/BookingService/Entities/BookingPolicy.cs

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // Cần nếu dùng Column/DatabaseGenerated

// --- Usings for related entities ---
// Policy liên quan đến OwnerProfile hoặc Space
using Backend.Api.Modules.UserService.Entities; // Cho OwnerProfile
using Backend.Api.Modules.SpaceService.Entities; // Cho Space
// Nếu BookingService và UserService/SpaceService ở các Namespace khác nhau, cần using

namespace Backend.Api.Modules.BookingService.Entities // Điều chỉnh Namespace cho phù hợp
{
    // Represents a template for booking terms, policies, or contracts
    // Can be associated with an OwnerProfile (shared) or a specific Space (override)
    public class BookingPolicy
    {
        #region Basic Properties

        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty; // Ví dụ: "Điều khoản chung của ABC Corp", "Nội quy riêng Space A101"

        [Required]
        [MaxLength(50)]
        public string Version { get; set; } = string.Empty; // Ví dụ: "1.0", "2025-T5"

        [Required]
        // Nội dung đầy đủ của điều khoản/chính sách.
        // Có thể cấu hình kiểu cột trong DbContext nếu cần (TEXT, NVARCHAR(MAX))
        public string Content { get; set; } = string.Empty;

        public DateTime EffectiveDate { get; set; } // Ngày bắt đầu áp dụng phiên bản này

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true; // Phiên bản này có đang được áp dụng không

        // Optional: Loại chính sách (ví dụ: "Chung", "Riêng", "Khuyến mãi")
        public string? PolicyType { get; set; }

        #endregion

        #region Relationships (Link to OwnerProfile OR Space)

        // *** Link đến OwnerProfile (Nếu đây là chính sách chung cho OwnerProfile) ***
        // Foreign Key có thể null
        public Guid? OwnerProfileId { get; set; }
        // Navigation Property tùy chọn
        public OwnerProfile? OwnerProfile { get; set; }

        // *** Link đến Space (Nếu đây là chính sách ĐẶC THÙ cho Space này) ***
        // Chính sách Space đặc thù thường sẽ ghi đè chính sách OwnerProfile chung
        // Foreign Key có thể null
        public Guid? SpaceId { get; set; }
        // Navigation Property tùy chọn
        public Space? Space { get; set; }

        // LƯU Ý QUAN TRỌNG: Database hoặc Business Logic cần đảm bảo
        // một BookingPolicy liên kết với ÍT NHẤT MỘT trong hai (OwnerProfileId hoặc SpaceId)
        // Bạn không thể dùng [Required] cho cả hai, và database constraint phức tạp có thể cần cấu hình thủ công.
        // Thông thường, việc này được xử lý bằng logic ứng dụng khi tạo Policy mới.

        #endregion

        #region Inverse Navigation Properties (Tùy chọn)

        // Inverse relationship to Bookings that use this policy version
        // Nếu bạn thêm AgreedPolicyId vào entity Booking, thêm Collection này vào đây:
        // public ICollection<Booking>? BookingsUsingThisPolicy { get; set; }

        #endregion
    }
}