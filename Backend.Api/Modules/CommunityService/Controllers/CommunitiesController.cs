// Backend.Api/Modules/CommunityService/Controllers/CommunitiesController.cs
using Microsoft.AspNetCore.Mvc;
using Backend.Api.Modules.CommunityService.Models;
using System;
using Backend.Api.Modules.CommunityService.Entities;

namespace Backend.Api.Modules.CommunityService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommunitiesController : ControllerBase
{
    [HttpGet]
    public IActionResult GetCommunities(int count = 10)
    {
        return null;
    }
}

// using Backend.Api.Modules.CommunityService.Entities;
// using Backend.Api.Modules.CommunityService.Models;
// using Backend.Api.Modules.CommunityService.Services;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Authorization;
// namespace Backend.Api.Modules.CommunityService.Controllers;

// [ApiController]
// [Route("api/[controller]")]
// public class CommunitiesController : ControllerBase
// {
//     private readonly ICommunityService _communityService;


//     public CommunitiesController(ICommunityService communityService)
//     {
//         _communityService = communityService;
//     }

//     [Authorize(Policy = "CommunityModerator")]
//     [HttpPut("{communityId}/settings")]
//     public IActionResult UpdateCommunitySettings(Guid communityId, [FromBody] CommunitySettings settings)
//     {
//         // ... code để cập nhật cài đặt community
//         return Ok();
//     }
//     [Authorize(Policy = "MinimumAge")]
//     [HttpGet("age")]
//     public IActionResult GetAgeRestrictedContent()
//     {
//         return Ok("Content only accessible to users 18 and older");
//     }

//     [HttpGet("{id}")]
//     public async Task<ActionResult<CommunityDto>> GetCommunity(Guid id)
//     {
//         var community = await _communityService.GetCommunityByIdAsync(id);

//         if (community == null)
//         {
//             return NotFound();
//         }

//         // Map Community to CommunityDto
//         var communityDto = new CommunityDto
//         {
//             Id = community.Id,
//             Name = community.Name,
//             Description = community.Description,
//             CreatedAt = community.CreatedAt
//         };

//         return communityDto;
//     }

//     [HttpGet]
//     public async Task<ActionResult<IEnumerable<CommunityDto>>> GetAllCommunities()
//     {
//         var communities = await _communityService.GetAllCommunitiesAsync();

//         var communityDtos = communities.Select(community => new CommunityDto
//         {
//             Id = community.Id,
//             Name = community.Name,
//             Description = community.Description,
//             CreatedAt = community.CreatedAt
//         });

//         return Ok(communityDtos);
//     }

//     [HttpPost]
//     public async Task<ActionResult<CommunityDto>> CreateCommunity(CreateCommunityRequest request)
//     {
//         var community = new Community
//         {
//             Name = request.Name,
//             Description = request.Description
//         };

//         var createdCommunity = await _communityService.CreateCommunityAsync(community);

//         if (createdCommunity == null)
//         {
//             return BadRequest();
//         }

//         // Map Community to CommunityDto
//         var communityDto = new CommunityDto
//         {
//             Id = createdCommunity.Id,
//             Name = createdCommunity.Name,
//             Description = createdCommunity.Description,
//             CreatedAt = createdCommunity.CreatedAt
//         };

//         return CreatedAtAction(nameof(GetCommunity), new { id = communityDto.Id }, communityDto);
//     }

//     [HttpPost("{communityId}/members")]
//     public async Task<IActionResult> AddCommunityMember(Guid communityId, [FromBody] AddCommunityMemberRequest request)
//     {
//         var result = await _communityService.AddCommunityMemberAsync(communityId, request.UserId);

//         if (!result)
//         {
//             return NotFound();
//         }

//         return Ok();
//     }

//     [HttpDelete("{communityId}/members/{userId}")]
//     public async Task<IActionResult> RemoveCommunityMember(Guid communityId, Guid userId)
//     {
//         var result = await _communityService.RemoveCommunityMemberAsync(communityId, userId);

//         if (!result)
//         {
//             return NotFound();
//         }

//         return NoContent();
//     }

//     [HttpGet("{communityId}/members/{userId}")]
//     public async Task<ActionResult<CommunityMemberDto>> GetCommunityMember(Guid communityId, Guid userId)
//     {
//         var communityMember = await _communityService.GetCommunityMemberAsync(communityId, userId);

//         if (communityMember == null)
//         {
//             return NotFound();
//         }

//         var communityMemberDto = new CommunityMemberDto
//         {
//             Id = communityMember.Id,
//             CommunityId = communityMember.CommunityId,
//             UserId = communityMember.UserId,
//             Role = communityMember.Role,
//             JoinedAt = communityMember.JoinedAt
//         };

//         return Ok(communityMemberDto);
//     }

//     [HttpPut("{communityId}/members/{userId}/role")]
//     public async Task<IActionResult> UpdateCommunityMemberRole(Guid communityId, Guid userId, [FromBody] CommunityRole role)
//     {
//         var result = await _communityService.UpdateCommunityMemberRoleAsync(communityId, userId, role);

//         if (!result)
//         {
//             return NotFound();
//         }

//         return NoContent();
//     }
// }