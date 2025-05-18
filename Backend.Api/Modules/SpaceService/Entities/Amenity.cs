// Backend.Api/Modules/SpaceService/Entities/Amenity.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.SpaceService.Entities
{
    public class Amenity
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        // Navigation property
        public ICollection<SpaceAmenity>? SpaceAmenities { get; set; }
    }
}