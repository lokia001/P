namespace Backend.Api.Modules.SpaceService.Dtos.Space
{
    public class UpdateSpaceImageRequestDto
    {
        [Url(ErrorMessage = "Invalid URL format.")]
        public string? ImageUrl { get; set; } // Cho phép cập nhật một phần

        public int? DisplayOrder { get; set; } // Cho phép cập nhật một phần
    }
}