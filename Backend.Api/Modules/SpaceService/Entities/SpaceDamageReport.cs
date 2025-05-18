// Backend.Api/Modules/SpaceService/Entities/SpaceDamageReport.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Api.Modules.BookingService.Entities;
using Backend.Api.Modules.SpaceService.Entities;
using Backend.Api.Modules.UserService.Entities;

namespace Backend.Api.Modules.SpaceService.Entities
{
    public enum DamageStatus
    {
        Reported,       // Mới được báo cáo
        UnderInvestigation, // Đang điều tra nguyên nhân/mức độ
        CostCalculated, // Đã xác định chi phí
        Invoiced,       // Đã đưa vào hóa đơn khách hàng
        Resolved,       // Đã xử lý (đã sửa chữa, đã thanh toán bồi thường)
        Closed,         // Đã đóng báo cáo
        Waived          // Quyết định không tính phí/bồi thường
    }

    // Represents a report about damage occurring in a Space, potentially linked to a specific booking
    public class SpaceDamageReport
    {
        #region Properties

        [Key]
        public Guid Id { get; set; } // Primary Key

        #endregion

        #region Relationships

        // *** Relationship: DamageReport (Many) -> Space (One) ***
        [Required]
        public Guid SpaceId { get; set; } // FK to the Space where damage occurred
        [ForeignKey("SpaceId")]
        public Space Space { get; set; } = default!; // Navigation Property to the Space

        // *** Link to the Booking during which damage occurred (Optional) ***
        public Guid? BookingId { get; set; } // FK to the Booking (Nullable - damage might be found later)
        [ForeignKey("BookingId")]
        public Booking? Booking { get; set; } // Navigation Property to the Booking (Nullable)

        // *** Reporting Details ***
        [Required]
        public Guid ReportedByUserId { get; set; } // FK to the User (Staff) who reported the damage
        [ForeignKey("ReportedByUserId")]
        public User ReportedByUser { get; set; } = default!; // Navigation Property to the Reporter

        #endregion

        #region Reporting Details

        [Required]
        public DateTime ReportedAt { get; set; } = DateTime.UtcNow; // Timestamp when the damage was reported

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty; // Detailed description of the damage

        public string? PhotoUrl { get; set; } // URL to photos of the damage (Optional)

        #endregion

        #region Resolution Details

        public DamageStatus Status { get; set; } = DamageStatus.Reported; // Current status of the report

        [Column(TypeName = "decimal(18,2)")]
        public decimal? EstimatedCost { get; set; } // Ước tính chi phí sửa chữa (Nullable)

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ActualCost { get; set; } // Chi phí sửa chữa thực tế (Nullable)

        public Guid? ResolvedByUserId { get; set; } // FK to the User (Admin/Manager) who resolved the report (Nullable)
        [ForeignKey("ResolvedByUserId")]
        public User? ResolvedByUser { get; set; } // Navigation Property to the Resolver (Nullable)

        public DateTime? ResolvedAt { get; set; } // Timestamp when the report was resolved (Nullable)

        [StringLength(1000)]
        public string? ResolutionNotes { get; set; } // Ghi chú về cách xử lý (Optional)

        // Optional: Link to the extra charge created for this damage
        // public Guid? ExtraChargeId { get; set; } // FK to BookingExtraCharge
        // [ForeignKey("ExtraChargeId")]
        // public BookingExtraCharge? ExtraCharge { get; set; }

        #endregion
    }
}