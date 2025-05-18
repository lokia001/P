using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.SpaceService.Models;

public class CreateSpaceRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }

    [Required]
    public string Type { get; set; } = "Individual"; // Enum dưới dạng string

    // [Range(1, 1000)]
    public int Capacity { get; set; }

    // [Range(0, double.MaxValue)]
    public decimal BasePrice { get; set; }

    [Required]
    public string Status { get; set; } = "Available";

    public int CleaningDurationMinutes { get; set; } = 0;

    public TimeSpan? OpenTime { get; set; }
    public TimeSpan? CloseTime { get; set; }

    public int MinBookingDurationMinutes { get; set; }
    public int MaxBookingDurationMinutes { get; set; }

    public int CancellationNoticeHours { get; set; }

    public string? AccessInstructions { get; set; }
    public string? HouseRules { get; set; }
    public string? PaymentMethodsSupported { get; set; }

    // Danh sách liên kết
    public List<string> Amenities { get; set; } = new();

    // public List<Guid> Amenities { get; set; } = new();
    public List<string> ImageUrls { get; set; } = new();
}
