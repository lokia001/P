using Backend.Api.Modules.CommunityService.Entities;
using Microsoft.EntityFrameworkCore;
using Backend.Api.Data;
namespace Backend.Api.Modules.CommunityService.Services;

public class CommunityService : ICommunityService
{
    private readonly AppDbContext _dbContext;

    public CommunityService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Community?> GetCommunityByIdAsync(Guid id)
    {
        // return await _dbContext.Communities.FindAsync(id);
        return null;
    }

    public async Task<List<Community>> GetAllCommunitiesAsync()
    {
        // return await _dbContext.Communities.ToListAsync();
        return null;
    }

    public async Task<Community?> CreateCommunityAsync(Community community)
    {
        // _dbContext.Communities.Add(community);
        // await _dbContext.SaveChangesAsync();
        // return community;
        return null;
    }

    public async Task<bool> AddCommunityMemberAsync(Guid communityId, Guid userId)
    {
        // var community = await _dbContext.Communities.FindAsync(communityId);
        // if (community == null)
        // {
        //     return false;
        // }

        // var communityMember = new CommunityMember
        // {
        //     CommunityId = communityId,
        //     UserId = userId
        // };

        // _dbContext.CommunityMembers.Add(communityMember);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveCommunityMemberAsync(Guid communityId, Guid userId)
    {
        // var communityMember = await _dbContext.CommunityMembers
        //     .FirstOrDefaultAsync(cm => cm.CommunityId == communityId && cm.UserId == userId);

        // if (communityMember == null)
        // {
        //     return false;
        // }

        // _dbContext.CommunityMembers.Remove(communityMember);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<CommunityMember?> GetCommunityMemberAsync(Guid communityId, Guid userId)
    {
        // return await _dbContext.CommunityMembers
        //     .FirstOrDefaultAsync(cm => cm.CommunityId == communityId && cm.UserId == userId);
        return null;
    }

    public async Task<bool> UpdateCommunityMemberRoleAsync(Guid communityId, Guid userId, CommunityRole role)
    {
        // var communityMember = await _dbContext.CommunityMembers
        //     .FirstOrDefaultAsync(cm => cm.CommunityId == communityId && cm.UserId == userId);

        // if (communityMember == null)
        // {
        //     return false;
        // }

        // communityMember.Role = role;
        // _dbContext.CommunityMembers.Update(communityMember);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}