// Backend.Api/Modules/CommentService/Controllers/CommentsController.cs
using Microsoft.AspNetCore.Mvc;
using Backend.Api.Modules.CommentService.Models;
using System;

namespace Backend.Api.Modules.CommentService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetComments(int count = 20)
    {

        return null;
    }
}

// using Backend.Api.Modules.CommentService.Entities;
// using Backend.Api.Modules.CommentService.Models;
// using Backend.Api.Modules.CommentService.Services;
// using Microsoft.AspNetCore.Mvc;

// namespace Backend.Api.Modules.CommentService.Controllers;

// [ApiController]
// [Route("api/[controller]")]
// public class CommentsController : ControllerBase
// {
//     private readonly ICommentService _commentService;

//     public CommentsController(ICommentService commentService)
//     {
//         _commentService = commentService;
//     }

//     [HttpGet("{id}")]
//     public async Task<ActionResult<CommentDto>> GetComment(Guid id)
//     {
//         var comment = await _commentService.GetCommentByIdAsync(id);

//         if (comment == null)
//         {
//             return NotFound();
//         }

//         // Map Comment to CommentDto
//         var commentDto = new CommentDto
//         {
//             Id = comment.Id,
//             PostId = comment.PostId,
//             UserId = comment.UserId,
//             Content = comment.Content,
//             CreatedAt = comment.CreatedAt,
//             UpdatedAt = comment.UpdatedAt,
//             ParentCommentId = comment.ParentCommentId
//         };

//         return commentDto;
//     }

//     [HttpGet("post/{postId}")]
//     public async Task<ActionResult<IEnumerable<CommentDto>>> GetCommentsByPostId(Guid postId)
//     {
//         var comments = await _commentService.GetCommentsByPostIdAsync(postId);

//         var commentDtos = comments.Select(comment => new CommentDto
//         {
//             Id = comment.Id,
//             PostId = comment.PostId,
//             UserId = comment.UserId,
//             Content = comment.Content,
//             CreatedAt = comment.CreatedAt,
//             UpdatedAt = comment.UpdatedAt,
//             ParentCommentId = comment.ParentCommentId
//         });

//         return Ok(commentDtos);
//     }

//     [HttpGet("{commentId}/replies")]
//     public async Task<ActionResult<IEnumerable<CommentDto>>> GetRepliesByCommentId(Guid commentId)
//     {
//         var replies = await _commentService.GetRepliesByCommentIdAsync(commentId);

//         var replyDtos = replies.Select(reply => new CommentDto
//         {
//             Id = reply.Id,
//             PostId = reply.PostId,
//             UserId = reply.UserId,
//             Content = reply.Content,
//             CreatedAt = reply.CreatedAt,
//             UpdatedAt = reply.UpdatedAt,
//             ParentCommentId = reply.ParentCommentId
//         });

//         return Ok(replyDtos);
//     }

//     [HttpPost]
//     public async Task<ActionResult<CommentDto>> CreateComment(CreateCommentRequest request)
//     {
//         var comment = new Comment
//         {
//             PostId = request.PostId,
//             UserId = request.UserId,
//             Content = request.Content,
//             ParentCommentId = request.ParentCommentId
//         };

//         var createdComment = await _commentService.CreateCommentAsync(comment);

//         if (createdComment == null)
//         {
//             return BadRequest();
//         }

//         // Map Comment to CommentDto
//         var commentDto = new CommentDto
//         {
//             Id = createdComment.Id,
//             PostId = createdComment.PostId,
//             UserId = createdComment.UserId,
//             Content = createdComment.Content,
//             CreatedAt = createdComment.CreatedAt,
//             UpdatedAt = createdComment.UpdatedAt,
//             ParentCommentId = createdComment.ParentCommentId
//         };

//         return CreatedAtAction(nameof(GetComment), new { id = commentDto.Id }, commentDto);
//     }

//     [HttpPut("{id}")]
//     public async Task<IActionResult> UpdateComment(Guid id, [FromBody] CreateCommentRequest request)
//     {
//         var result = await _commentService.UpdateCommentAsync(id, request.Content);

//         if (!result)
//         {
//             return NotFound();
//         }

//         return NoContent();
//     }

//     [HttpDelete("{id}")]
//     public async Task<IActionResult> DeleteComment(Guid id)
//     {
//         var result = await _commentService.DeleteCommentAsync(id);

//         if (!result)
//         {
//             return NotFound();
//         }

//         return NoContent();
//     }
// }