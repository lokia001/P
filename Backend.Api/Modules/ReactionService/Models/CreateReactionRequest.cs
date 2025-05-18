using System.ComponentModel.DataAnnotations;
using Backend.Api.Modules.ReactionService.Entities;

namespace Backend.Api.Modules.ReactionService.Models;

public class CreateReactionRequest
{
    [Required]
    public Guid UserId { get; set; }
    [Required]
    public ReactionType Type { get; set; }
    [Required]
    public string TargetType { get; set; } = string.Empty;
    [Required]
    public Guid TargetId { get; set; }
}