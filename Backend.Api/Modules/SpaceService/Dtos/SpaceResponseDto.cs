// File: Backend.Api/Modules/SpaceService/Dtos/Space/SpaceResponseDto.cs
using System;
using System.Collections.Generic;
using Backend.Api.Modules.SpaceService.Entities; // For Enums
using Backend.Api.Modules.SpaceService.Dtos.Amenity; // For AmenityDto
using Backend.Api.Modules.SpaceService.Dtos.ServiceSpace; // For ServiceSpaceDto

namespace Backend.Api.Modules.SpaceService.Dtos.Space
{
    public class SpaceResponseDto
    {
        // --- Basic Space Info ---
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Address { get; set; }
        public decimal Latitude { get; set; }
        public decimal Longitude { get; set; }
        public SpaceType Type { get; set; }
        public SpaceStatus Status { get; set; }
        public int Capacity { get; set; }

        // --- Pricing Info ---
        public decimal BasePrice { get; set; }
        public decimal? HourlyPrice { get; set; }
        public decimal? DailyPrice { get; set; }

        // --- Time & Booking Constraints ---
        public TimeSpan? OpenTime { get; set; }
        public TimeSpan? CloseTime { get; set; }
        public int CleaningDurationMinutes { get; set; }
        public int BufferMinutes { get; set; }
        public int MinBookingDurationMinutes { get; set; }
        public int MaxBookingDurationMinutes { get; set; }
        public int CancellationNoticeHours { get; set; }

        // --- Audit & Ownership Info ---
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public Guid CreatedByUserId { get; set; }
        public Guid? LastEditedByUserId { get; set; }
        public Guid OwnerProfileId { get; set; }
        // Bạn có thể muốn thêm thông tin của OwnerProfile ở đây nếu cần
        // public OwnerProfileBasicDto Owner {get; set;} // Ví dụ

        // --- Related Entities ---
        public List<SpaceImageResponseDto>? Images { get; set; } // Danh sách DTO của hình ảnh
        public List<AmenityDto>? Amenities { get; set; }       // Danh sách DTO của tiện nghi
        public List<ServiceSpaceDto>? Services { get; set; }    // Danh sách DTO của dịch vụ liên kết (bao gồm thông tin từ bảng nối)

        // Các thuộc tính khác bạn muốn trả về
        // public double? AverageRating { get; set; }
        // public int TotalReviews { get; set; }
    }
}