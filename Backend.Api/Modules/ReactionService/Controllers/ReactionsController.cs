// Backend.Api/Modules/ReactionService/Controllers/ReactionsController.cs
using Microsoft.AspNetCore.Mvc;
using Backend.Api.Modules.ReactionService.Models;
using System;
using Backend.Api.Modules.ReactionService.Entities;

namespace Backend.Api.Modules.ReactionService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReactionsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetReactions(int count = 30)
    {
        return null;
    }
}

// using Backend.Api.Modules.ReactionService.Entities;
// using Backend.Api.Modules.ReactionService.Models;
// using Backend.Api.Modules.ReactionService.Services;
// using Microsoft.AspNetCore.Mvc;

// namespace Backend.Api.Modules.ReactionService.Controllers;

// [ApiController]
// [Route("api/[controller]")]
// public class ReactionsController : ControllerBase
// {
//     private readonly IReactionService _reactionService;

//     public ReactionsController(IReactionService reactionService)
//     {
//         _reactionService = reactionService;
//     }

//     [HttpGet("{id}")]
//     public async Task<ActionResult<ReactionDto>> GetReaction(Guid id)
//     {
//         var reaction = await _reactionService.GetReactionByIdAsync(id);

//         if (reaction == null)
//         {
//             return NotFound();
//         }

//         // Map Reaction to ReactionDto
//         var reactionDto = new ReactionDto
//         {
//             Id = reaction.Id,
//             UserId = reaction.UserId,
//             Type = reaction.ReactionType,
//             TargetType = reaction.TargetType,
//             TargetId = reaction.TargetId,
//             CreatedAt = reaction.CreatedAt
//         };

//         return reactionDto;
//     }

//     [HttpGet("target/{targetType}/{targetId}")]
//     public async Task<ActionResult<IEnumerable<ReactionDto>>> GetReactionsByTarget(string targetType, Guid targetId)
//     {
//         var reactions = await _reactionService.GetReactionsByTargetAsync(targetType, targetId);

//         var reactionDtos = reactions.Select(reaction => new ReactionDto
//         {
//             Id = reaction.Id,
//             UserId = reaction.UserId,
//             Type = reaction.ReactionType,
//             TargetType = reaction.TargetType,
//             TargetId = reaction.TargetId,
//             CreatedAt = reaction.CreatedAt
//         });

//         return Ok(reactionDtos);
//     }

//     [HttpPost]
//     public async Task<ActionResult<ReactionDto>> CreateReaction(CreateReactionRequest request)
//     {
//         // Check if reaction exists, if it does, delete it
//         var existingReaction = await _reactionService.GetReactionAsync(request.UserId, request.TargetType, request.TargetId);
//         if (existingReaction != null)
//         {
//             await _reactionService.DeleteReactionAsync(existingReaction.Id);
//         }

//         var reaction = new Reaction
//         {
//             UserId = request.UserId,
//             ReactionType = request.Type,
//             TargetType = request.TargetType,
//             TargetId = request.TargetId
//         };

//         var createdReaction = await _reactionService.CreateReactionAsync(reaction);

//         if (createdReaction == null)
//         {
//             return BadRequest();
//         }

//         // Map Reaction to ReactionDto
//         var reactionDto = new ReactionDto
//         {
//             Id = createdReaction.Id,
//             UserId = createdReaction.UserId,
//             Type = createdReaction.ReactionType,
//             TargetType = createdReaction.TargetType,
//             TargetId = createdReaction.TargetId,
//             CreatedAt = createdReaction.CreatedAt
//         };

//         return CreatedAtAction(nameof(GetReaction), new { id = reactionDto.Id }, reactionDto);
//     }

//     [HttpDelete("{id}")]
//     public async Task<IActionResult> DeleteReaction(Guid id)
//     {
//         var result = await _reactionService.DeleteReactionAsync(id);

//         if (!result)
//         {
//             return NotFound();
//         }

//         return NoContent();
//     }
// }