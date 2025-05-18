namespace Backend.Api.Modules.SpaceService.Dtos.Amenity
{
    public class CreateAmenityDto
    {
        [Required(ErrorMessage = "Amenity name is required.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Amenity name must be between 2 and 100 characters.")]
        public string Name { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string? Description { get; set; }
    }
}