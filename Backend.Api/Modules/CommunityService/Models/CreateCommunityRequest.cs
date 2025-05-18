using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.CommunityService.Models;

public class CreateCommunityRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}