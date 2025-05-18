// Backend.Api/Modules/BookingService/Entities/BookingServiceItem.cs // Suggested module/path
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Api.Modules.BookingService.Entities; // For Booking
using Backend.Api.Modules.ServiceService.Entities; // For Service
using Backend.Api.Modules.UserService.Entities; // For Service

namespace Backend.Api.Modules.BookingService.Entities
{
    // Represents a specific service item added to a booking (often ad-hoc or part of a package)
    public class BookingServiceItem
    {
        [Key]
        public Guid Id { get; set; } // Primary Key

        // *** Relationship: BookingServiceItem (Many) -> Booking (One) ***
        [Required]
        public Guid BookingId { get; set; } // FK to the Booking this item belongs to
        public Booking Booking { get; set; } = default!; // Navigation Property to the Booking

        // *** Relationship: BookingServiceItem (Many) -> Service (One) ***
        [Required]
        public Guid ServiceId { get; set; } // FK to the Service being provided
        public ServiceEntity Service { get; set; } = default!; // Navigation Property to the Service

        // *** Details of the Service Instance in this Booking ***
        public int Quantity { get; set; } = 1; // Số lượng (nếu Unit là PerItem, PerPerson)
        public TimeSpan? Duration { get; set; } // Thời lượng (nếu Unit là PerHour)
        public DateTime? ServiceStartTime { get; set; } // Thời điểm bắt đầu sử dụng dịch vụ (nếu tính theo giờ)
        public DateTime? ServiceEndTime { get; set; } // Thời điểm kết thúc sử dụng dịch vụ

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePerUnit { get; set; } // Giá của đơn vị dịch vụ TẠI THỜI ĐIỂM booking/thêm vào (để tránh giá Service thay đổi làm sai lệch booking cũ)

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; } // Tổng tiền cho mục dịch vụ này (Quantity/Duration * PricePerUnit)

        [StringLength(500)]
        public string? Notes { get; set; } // Ghi chú về dịch vụ này (ví dụ: yêu cầu đặc biệt)

        // *** Audit Fields ***
        public DateTime AddedAt { get; set; } = DateTime.UtcNow; // Thời điểm dịch vụ này được thêm vào booking
        // Optional: Track who added this service item
        public Guid? AddedByUserId { get; set; } // FK to the User (Staff/Admin) who added this (Nullable)
        public User? AddedByUser { get; set; } // Optional Navigation Property

        // Optional: Link to the extra charge created for this service item if it's added ad-hoc
        // public Guid? ExtraChargeId { get; set; } // FK to BookingExtraCharge
        // public BookingExtraCharge? ExtraCharge { get; set; }
    }
}