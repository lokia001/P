// File: Backend.Api/Modules/SpaceService/Dtos/Space/CreateSpaceWithDetailsRequestDto.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Backend.Api.Modules.SpaceService.Entities; // For SpaceType enum

namespace Backend.Api.Modules.SpaceService.Dtos.Space
{
    public class CreateSpaceWithDetailsRequestDto
    {
        // --- Basic Space Info ---
        [Required(ErrorMessage = "Space name is required.")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 200 characters.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters.")]
        public string? Description { get; set; }

        [StringLength(500, ErrorMessage = "Address cannot exceed 500 characters.")]
        public string? Address { get; set; }

        // Latitude and Longitude validation can be more complex (e.g., custom attribute or FluentValidation)
        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90.")]
        public decimal Latitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180.")]
        public decimal Longitude { get; set; }

        [Required(ErrorMessage = "Space type is required.")]
        [EnumDataType(typeof(SpaceType), ErrorMessage = "Invalid space type.")]
        public SpaceType Type { get; set; }

        [Required(ErrorMessage = "Capacity is required.")]
        [Range(1, 1000, ErrorMessage = "Capacity must be between 1 and 1000.")]
        public int Capacity { get; set; }

        [Required(ErrorMessage = "Base price is required.")]
        [Range(0, double.MaxValue, ErrorMessage = "Base price must be non-negative.")]
        public decimal BasePrice { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Hourly price must be non-negative.")]
        public decimal? HourlyPrice { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Daily price must be non-negative.")]
        public decimal? DailyPrice { get; set; }

        // TimeSpan validation is tricky with data annotations. FluentValidation is better.
        // For simplicity, we'll rely on model binding to attempt conversion.
        public TimeSpan? OpenTime { get; set; } // Format "HH:mm:ss" or "HH:mm"
        public TimeSpan? CloseTime { get; set; }

        [Range(0, 1440, ErrorMessage = "Cleaning duration must be between 0 and 1440 minutes.")]
        public int? CleaningDurationMinutes { get; set; }

        [Range(0, 1440, ErrorMessage = "Buffer time must be between 0 and 1440 minutes.")]
        public int? BufferMinutes { get; set; }

        [Range(1, 10080, ErrorMessage = "Minimum booking duration must be between 1 and 10080 minutes (7 days).")] // Example range
        public int? MinBookingDurationMinutes { get; set; }

        [Range(1, 43200, ErrorMessage = "Maximum booking duration must be between 1 and 43200 minutes (30 days).")] // Example range
        public int? MaxBookingDurationMinutes { get; set; }

        [Range(0, 720, ErrorMessage = "Cancellation notice must be between 0 and 720 hours (30 days).")] // Example range
        public int? CancellationNoticeHours { get; set; }

        // --- Amenity IDs ---
        public List<Guid>? AmenityIds { get; set; }

        // --- Service Info ---
        public List<SpaceServiceCreationDto>? Services { get; set; }

        // OwnerProfileId sẽ được lấy từ JWT, không cần trong DTO này
        // CreatedByUserId cũng sẽ được lấy từ JWT
    }
}