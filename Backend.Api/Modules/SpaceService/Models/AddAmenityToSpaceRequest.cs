
namespace Backend.Api.Modules.SpaceService.Models;
using System.ComponentModel.DataAnnotations;

public class AddAmenityToSpaceRequest
{
    [Required]
    public Guid AmenityId { get; set; }
}