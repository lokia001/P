namespace Backend.Api.Modules.SpaceService.Dtos.Space
{
    public class CreateSpaceImageRequestDto
    {
        // SpaceId sẽ được cung cấp từ route hoặc context
        // public Guid SpaceId { get; set; }

        [Required(ErrorMessage = "Image URL is required.")]
        [Url(ErrorMessage = "Invalid URL format.")]
        public string ImageUrl { get; set; } = string.Empty;

        public int DisplayOrder { get; set; } = 0;
    }
}