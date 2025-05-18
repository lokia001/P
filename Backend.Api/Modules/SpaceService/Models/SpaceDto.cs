// using System.ComponentModel.DataAnnotations;

// namespace Backend.Api.Modules.SpaceService.Models;

// public class SpaceDto
// {
//     public Guid Id { get; set; }

//     public string Name { get; set; } = string.Empty;

//     public string Description { get; set; } = string.Empty;

//     [Required]
//     public string Address { get; set; } = string.Empty;

//     public decimal Latitude { get; set; }
//     public decimal Longitude { get; set; }

//     public string Type { get; set; } = "Individual"; // Enum dưới dạng chuỗi

//     public int Capacity { get; set; }

//     public decimal BasePrice { get; set; }

//     public string Status { get; set; } = "Available";

//     public int CleaningDurationMinutes { get; set; }

//     public TimeSpan? OpenTime { get; set; }
//     public TimeSpan? CloseTime { get; set; }

//     public int MinBookingDurationMinutes { get; set; }
//     public int MaxBookingDurationMinutes { get; set; }

//     public int CancellationNoticeHours { get; set; }

//     public string? AccessInstructions { get; set; }
//     public string? HouseRules { get; set; }

//     public string? PaymentMethodsSupported { get; set; }

//     public double? AverageRating { get; set; }
//     public int TotalReviews { get; set; }

//     public string? Slug { get; set; }

//     public DateTime CreatedAt { get; set; }
//     public DateTime? UpdatedAt { get; set; }

//     // Liên kết nhiều-nhiều với bảng khác
//     public List<string> AmenityNames { get; set; } = new();      // từ SpaceAmenity.Amenity.Name

//     public List<string> ImageUrls { get; set; } = new();         // từ SpaceImage.ImageUrl

//     public List<Guid> OwnerProfileIds { get; set; } = new();     // từ SpaceOwner.OwnerProfileId
// }



namespace Backend.Api.Modules.SpaceService.Models;
using System.ComponentModel.DataAnnotations;

public class SpaceDto
{
    public Guid Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }

    public string Type { get; set; } = "Individual"; // Có thể dùng enum string hoặc int

    public int Capacity { get; set; }

    public decimal BasePrice { get; set; }
    public decimal? HourlyPrice { get; set; }
    public decimal? DailyPrice { get; set; }

    public string Status { get; set; } = "Available";

    public TimeSpan? OpenTime { get; set; }
    public TimeSpan? CloseTime { get; set; }

    public int CleaningDurationMinutes { get; set; }

    public int MinBookingDurationMinutes { get; set; }
    public int MaxBookingDurationMinutes { get; set; }
    public int CancellationNoticeHours { get; set; }

    public string? AccessInstructions { get; set; }
    public string? HouseRules { get; set; }

    public string? PaymentMethodsSupported { get; set; }

    public double? AverageRating { get; set; }
    public int TotalReviews { get; set; }

    public string? Slug { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public List<string> Amenities { get; set; } = new();     // Guid hoặc Name tuỳ cách mapping
    public List<string> ImageUrls { get; set; } = new();     // URL hình ảnh
}
