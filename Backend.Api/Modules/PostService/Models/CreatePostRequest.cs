using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.PostService.Models;

public class CreatePostRequest
{
    [Required]
    public Guid CommunityId { get; set; }
    [Required]
    public Guid UserId { get; set; }
    [Required]
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
}