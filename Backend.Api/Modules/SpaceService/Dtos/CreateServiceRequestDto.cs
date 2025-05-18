// File: Backend.Api/Modules/ServiceService/Dtos/Service/CreateServiceRequestDto.cs
using System.ComponentModel.DataAnnotations;
using Backend.Api.Modules.ServiceService.Entities; // For PriceUnit enum

namespace Backend.Api.Modules.ServiceService.Dtos.Service
{
    public class CreateServiceRequestDto
    {
        [Required(ErrorMessage = "Service name is required.")]
        [StringLength(150, MinimumLength = 2, ErrorMessage = "Service name must be between 2 and 150 characters.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Base price is required.")]
        [Range(0, double.MaxValue, ErrorMessage = "Base price must be non-negative.")]
        public decimal BasePrice { get; set; }

        [Required(ErrorMessage = "Price unit is required.")]
        [EnumDataType(typeof(PriceUnit), ErrorMessage = "Invalid price unit.")]
        public PriceUnit Unit { get; set; }

        public bool IsAvailableAdHoc { get; set; } = true;
        public bool IsPricedPerBooking { get; set; } = false;
    }
}