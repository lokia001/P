using Backend.Api.Modules.CommunityService.Entities;

namespace Backend.Api.Modules.CommunityService.Models;

public class CommunityMemberDto
{
    public Guid Id { get; set; }
    public Guid CommunityId { get; set; }
    public Guid UserId { get; set; }
    public CommunityRole Role { get; set; }
    public DateTime JoinedAt { get; set; }
}