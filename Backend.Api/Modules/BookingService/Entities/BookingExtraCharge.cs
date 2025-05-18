// Backend.Api/Modules/BookingService/Entities/BookingExtraCharge.cs // Suggested module/path
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Api.Modules.BookingService.Entities; // For Booking
using Backend.Api.Modules.UserService.Entities; // For User (if tracking who created charge)

namespace Backend.Api.Modules.BookingService.Entities
{
    public enum ExtraChargeType
    {
        Overstay,       // Phí ở quá giờ
        Damage,         // Phí bồi thường thiệt hại
        AdditionalService, // Phí dịch vụ thêm tại chỗ (nếu không dùng BookingServiceItem chi tiết)
        Adjustment,     // Điều chỉnh chung (ví dụ: giảm giá đặc biệt, bồi thường khách hàng)
        Penalty         // Các loại phí phạt khác
        // Add other types as needed
    }

    public enum ExtraChargeStatus // Trạng thái xử lý của khoản phí này
    {
        Pending,    // Đang chờ xác nhận/tính toán
        Applied,    // Đã được thêm vào tổng tiền booking
        Invoiced,   // Đã được đưa vào hóa đơn
        Paid,       // Đã được khách thanh toán
        Waived,     // Đã được miễn (không tính)
        Cancelled   // Đã bị hủy
    }


    // Represents an extra charge or adjustment applied to a booking after its initial creation
    public class BookingExtraCharge
    {
        [Key]
        public Guid Id { get; set; } // Primary Key

        // *** Relationship: BookingExtraCharge (Many) -> Booking (One) ***
        [Required]
        public Guid BookingId { get; set; } // FK to the Booking this charge applies to
        public Booking Booking { get; set; } = default!; // Navigation Property to the Booking

        public ExtraChargeType Type { get; set; } // Loại khoản phí phát sinh

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; } // Số tiền của khoản phí/điều chỉnh này (có thể âm cho giảm giá/bồi thường)

        [StringLength(500)]
        public string? Description { get; set; } // Mô tả chi tiết về khoản phí (ví dụ: quá giờ 30 phút, vỡ kính)

        public ExtraChargeStatus Status { get; set; } = ExtraChargeStatus.Pending; // Trạng thái xử lý khoản phí

        // *** Audit Fields ***
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Thời điểm bản ghi phí được tạo
        // Optional: Track who recorded this extra charge
        public Guid? RecordedByUserId { get; set; } // FK to the User (Staff/Admin) who recorded this (Nullable)
                                                    // public User? RecordedByUser { get; set; } // Optional Navigation Property

        // Creator/AssignedBy User (Many BookingExtraCharge -> One User)
        public Guid? CreatedByUserId { get; set; } // FK trỏ về User (người tạo/gán khoản phí)
        public User? CreatedByUser { get; set; } // Nav Property trỏ về User

        public DateTime? UpdatedAt { get; set; } // Thời điểm cập nhật trạng thái/amount

        // Optional: Link to related entities if needed (e.g., if type is Damage, link to SpaceDamageReport)
        public Guid? RelatedEntityId { get; set; }
        public string? RelatedEntityType { get; set; } // (Polymorphic link to DamageReport, ServiceItem, etc.)
    }
}