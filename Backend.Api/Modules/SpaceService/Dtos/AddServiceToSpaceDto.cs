namespace Backend.Api.Modules.SpaceService.Dtos.ServiceSpace
{
    public class AddServiceToSpaceDto
    {
        // SpaceId thường được lấy từ route
        [Required(ErrorMessage = "Service ID is required.")]
        public Guid ServiceId { get; set; }

        [StringLength(1000, ErrorMessage = "Notes cannot exceed 1000 characters.")]
        public string? Notes { get; set; }

        public bool IsIncludedInBasePrice { get; set; } = false;

        [Range(0, double.MaxValue, ErrorMessage = "Price override must be a non-negative value.")]
        public decimal? PriceOverride { get; set; } // Giá cụ thể cho service này tại space này
    }
}