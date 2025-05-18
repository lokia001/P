// Backend.Api/Modules/SpaceService/Models/UpdateAmenityRequest.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.SpaceService.Models;

public class UpdateAmenityRequest
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}