// Backend.Api/Modules/SpaceService/Entities/SpaceImage.cs
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Api.Modules.SpaceService.Entities
{
    public class SpaceImage
    {
        #region Properties

        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid SpaceId { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public int DisplayOrder { get; set; } = 0;

        #endregion

        #region Navigation Properties

        // Navigation property
        [ForeignKey("SpaceId")] // Explicitly define foreign key (optional but good practice)
        public Space Space { get; set; } = default!;

        #endregion
    }
}