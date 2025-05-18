using Backend.Api.Modules.ReactionService.Entities;
using Microsoft.EntityFrameworkCore;
using Backend.Api.Data;
namespace Backend.Api.Modules.ReactionService.Services;

public class ReactionService : IReactionService
{
    private readonly AppDbContext _dbContext;

    public ReactionService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Reaction?> GetReactionByIdAsync(Guid id)
    {
        // return await _dbContext.Reactions.FindAsync(id);
        return null;

    }

    public async Task<Reaction?> GetReactionAsync(Guid userId, string targetType, Guid targetId)
    {
        return null;
    }

    public async Task<List<Reaction>> GetReactionsByTargetAsync(string targetType, Guid targetId)
    {
        return [];
    }

    public async Task<Reaction?> CreateReactionAsync(Reaction reaction)
    {
        // _dbContext.Reactions.Add(reaction);
        await _dbContext.SaveChangesAsync();
        return reaction;
    }

    public async Task<bool> DeleteReactionAsync(Guid id)
    {
        // var reaction = await _dbContext.Reactions.FindAsync(id);
        // if (reaction == null)
        // {
        //     return false;
        // }

        // _dbContext.Reactions.Remove(reaction);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}