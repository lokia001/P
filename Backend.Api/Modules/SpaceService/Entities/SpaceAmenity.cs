// Backend.Api/Modules/SpaceService/Entities/SpaceAmenity.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.SpaceService.Entities
{
    public class SpaceAmenity
    {
        #region Basic Properties

        [Key]
        public Guid SpaceAmenityId { get; set; }

        #endregion

        #region Foreign Keys

        [Required]
        public Guid SpaceId { get; set; }

        [Required]
        public Guid AmenityId { get; set; }

        #endregion

        #region Navigation Properties

        public Space Space { get; set; } = default!;
        public Amenity Amenity { get; set; } = default!;

        #endregion
    }
}