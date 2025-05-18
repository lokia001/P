// Backend.Api/Modules/ServiceService/Entities/Service.cs // Suggested module/path
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Api.Modules.SpaceService.Entities; // If Services can be specific to Spaces

namespace Backend.Api.Modules.ServiceService.Entities
{
    public enum PriceUnit
    {
        PerHour,
        PerItem,
        PerPerson,
        Fixed,
        PerBooking
    }

    // Represents a service that can be offered (e.g., catering, equipment rental, cleaning service)
    public class ServiceEntity
    {
        [Key]
        public Guid Id { get; set; } // Primary Key

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal BasePrice { get; set; } // Price per unit or fixed price

        public PriceUnit Unit { get; set; } // How the price is calculated (per hour, per item, etc.)

        public bool IsAvailableAdHoc { get; set; } = true; // Can this service be added during a booking?
        public bool IsPricedPerBooking { get; set; } = false; // Is the price per booking regardless of quantity/duration?


        // Optional: If Services can only be offered in specific Spaces (N-N)
        public ICollection<ServiceSpace>? ServiceSpaces { get; set; } // Link via join entity

        // Audit Fields
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}