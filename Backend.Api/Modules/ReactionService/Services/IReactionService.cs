using Backend.Api.Modules.ReactionService.Entities;

namespace Backend.Api.Modules.ReactionService.Services;

public interface IReactionService
{
    Task<Reaction?> GetReactionByIdAsync(Guid id);
    Task<Reaction?> GetReactionAsync(Guid userId, string targetType, Guid targetId);
    Task<List<Reaction>> GetReactionsByTargetAsync(string targetType, Guid targetId);
    Task<Reaction?> CreateReactionAsync(Reaction reaction);
    Task<bool> DeleteReactionAsync(Guid id);
}