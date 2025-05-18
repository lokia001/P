// Backend.Api/Modules/SpaceService/Entities/SpaceService.cs

namespace Backend.Api.Modules.SpaceService.Entities;

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Api.Modules.ServiceService.Entities;

// Entity trung gian cho mối quan hệ N-N giữa Space và Service
public class ServiceSpace
{
    #region Properties

    [Key]
    public Guid Id { get; set; }

    #endregion

    #region Foreign Keys

    [Required]
    public Guid SpaceId { get; set; } // FK trỏ đến Space

    [Required]
    public Guid ServiceId { get; set; } // FK trỏ đến Service

    #endregion

    #region Navigation Properties

    [ForeignKey("SpaceId")]
    public Space Space { get; set; } = default!;

    [ForeignKey("ServiceId")]
    public ServiceEntity Service { get; set; } = default!;

    #endregion

    #region Additional Properties for the Relationship

    [Column(TypeName = "decimal(18,2)")]
    public decimal? PriceOverride { get; set; } // Giá cụ thể cho service này tại space này (nếu khác giá gốc của service)
    public string? Notes { get; set; } // Ghi chú về Service này ở Space này

    public bool IsIncludedInBasePrice { get; set; } = false; // Service này có bao gồm trong giá thuê Space không

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Thời điểm liên kết được tạo (tùy chọn)

    #endregion
}
