namespace Backend.Api.Modules.SpaceService.Dtos.ServiceSpace
{
    public class ServiceSpaceDto
    {
        public Guid Id { get; set; }
        public Guid SpaceId { get; set; }
        public Guid ServiceId { get; set; }
        public string? Notes { get; set; }
        public bool IsIncludedInBasePrice { get; set; }
        public DateTime CreatedAt { get; set; }

        // Có thể thêm thông tin từ Service nếu cần hiển thị trực tiếp
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
        public decimal? PriceOverride { get; set; } // Giá cụ thể cho service này tại space này (nếu khác giá gốc của service)
    }
}