using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.CommunityService.Models;

public class AddCommunityMemberRequest
{
    [Required]
    public Guid UserId { get; set; }
}