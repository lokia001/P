namespace Backend.Api.Modules.SpaceService.Dtos.ServiceSpace
{
    // Dùng để cập nhật thông tin của một Service cụ thể đã được gán cho Space
    public class UpdateServiceOnSpaceDto
    {
        // SpaceId và ServiceId thường được lấy từ route để xác định bản ghi cần cập nhật

        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters.")]
        public string? Notes { get; set; } // Cho phép cập nhật một phần

        [Range(0, double.MaxValue, ErrorMessage = "Price override must be a non-negative value.")]
        public decimal? PriceOverride { get; set; } // Cho phép cập nhật giá (tùy chọn)

        public bool? IsIncludedInBasePrice { get; set; } // Cho phép cập nhật một phần
    }
}