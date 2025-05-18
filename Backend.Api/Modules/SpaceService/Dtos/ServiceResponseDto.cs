// File: Backend.Api/Modules/ServiceService/Dtos/Service/ServiceResponseDto.cs
using System;
using Backend.Api.Modules.ServiceService.Entities; // For PriceUnit enum

namespace Backend.Api.Modules.ServiceService.Dtos.Service
{
    public class ServiceResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal BasePrice { get; set; }
        public PriceUnit Unit { get; set; }
        public bool IsAvailableAdHoc { get; set; }
        public bool IsPricedPerBooking { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}