using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.CommentService.Models;

public class CreateCommentRequest
{
    [Required]
    public Guid PostId { get; set; }
    [Required]
    public Guid UserId { get; set; }
    [Required]
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }
}