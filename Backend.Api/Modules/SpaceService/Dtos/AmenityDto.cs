namespace Backend.Api.Modules.SpaceService.Dtos.Amenity
{
    public class AmenityDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}