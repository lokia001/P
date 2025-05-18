namespace Backend.Api.Modules.SpaceService.Dtos.Space
{
    public class SpaceAmenityDto
    {
        public Guid SpaceAmenityId { get; set; }
        public Guid SpaceId { get; set; }
        public Guid AmenityId { get; set; }
        // Có thể thêm thông tin từ Amenity nếu cần hiển thị trực tiếp
        public string AmenityName { get; set; }
        public string AmenityDescription { get; set; }


    }
}