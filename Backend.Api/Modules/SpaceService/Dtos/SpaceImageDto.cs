// File: Backend.Api/Modules/SpaceService/Dtos/Space/SpaceImageDto.cs
namespace Backend.Api.Modules.SpaceService.Dtos.Space
{
    public class SpaceImageDto
    {
        public Guid Id { get; set; }
        public Guid SpaceId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }
}