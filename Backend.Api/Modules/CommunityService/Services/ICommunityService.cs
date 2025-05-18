using Backend.Api.Modules.CommunityService.Entities;

namespace Backend.Api.Modules.CommunityService.Services;

public interface ICommunityService
{
    Task<Community?> GetCommunityByIdAsync(Guid id);
    Task<List<Community>> GetAllCommunitiesAsync();
    Task<Community?> CreateCommunityAsync(Community community);
    Task<bool> AddCommunityMemberAsync(Guid communityId, Guid userId);
    Task<bool> RemoveCommunityMemberAsync(Guid communityId, Guid userId);
    Task<CommunityMember?> GetCommunityMemberAsync(Guid communityId, Guid userId);
    Task<bool> UpdateCommunityMemberRoleAsync(Guid communityId, Guid userId, CommunityRole role);
}