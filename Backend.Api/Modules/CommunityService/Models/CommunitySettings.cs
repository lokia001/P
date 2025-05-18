// Backend.Api/Modules/CommunityService/Models/CommunitySettings.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.CommunityService.Models;

public class CommunitySettings
{
    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }
    // Thêm các setting khác cho community ở đây
}