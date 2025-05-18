// Backend.Api/Modules/ReactionService/Models/ReactionDto.cs
using Backend.Api.Modules.ReactionService.Entities;

namespace Backend.Api.Modules.ReactionService.Models;

public class ReactionDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string TargetType { get; set; } = string.Empty;
    public Guid TargetId { get; set; }
    public ReactionType ReactionType { get; set; }
    public DateTime CreatedAt { get; set; }
}