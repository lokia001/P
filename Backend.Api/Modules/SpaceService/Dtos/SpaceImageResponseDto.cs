namespace Backend.Api.Modules.SpaceService.Dtos.Space
{
    public class SpaceImageResponseDto
    {
        public Guid Id { get; set; }
        public Guid SpaceId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        // Giả sử DTO của bạn có trường IsMain, nếu không có thì bỏ đi
        public bool IsMain { get; set; } // Thêm IsMain nếu có trong DTO
    }
}