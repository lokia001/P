using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.SpaceService.Models;

public class CreateAmenityRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}