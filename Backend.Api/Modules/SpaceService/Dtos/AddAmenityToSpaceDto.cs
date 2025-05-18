namespace Backend.Api.Modules.SpaceService.Dtos.Space
{
    // Dùng để thêm một Amenity vào Space
    public class AddAmenityToSpaceDto
    {
        [Required(ErrorMessage = "Amenity ID is required.")]
        public Guid AmenityId { get; set; }
        // SpaceId thường được lấy từ route
    }
}
// Lưu ý: Việc xóa thường chỉ cần SpaceId và AmenityId, không cần DTO riêng.