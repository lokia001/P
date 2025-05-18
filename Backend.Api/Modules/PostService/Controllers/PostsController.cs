using Microsoft.AspNetCore.Mvc;
using Backend.Api.Modules.PostService.Models;
using System;
using System.Collections.Generic;

namespace Backend.Api.Modules.PostService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetPosts(int count = 10)
    {


        return null;
    }
}

// using Backend.Api.Modules.PostService.Entities;
// using Backend.Api.Modules.PostService.Models;
// using Backend.Api.Modules.PostService.Services;
// using Microsoft.AspNetCore.Mvc;

// namespace Backend.Api.Modules.PostService.Controllers;

// [ApiController]
// [Route("api/[controller]")]
// public class PostsController : ControllerBase
// {
//     private readonly IPostService _postService;

//     public PostsController(IPostService postService)
//     {
//         _postService = postService;
//     }

//     [HttpGet("{id}")]
//     public async Task<ActionResult<PostDto>> GetPost(Guid id)
//     {
//         var post = await _postService.GetPostByIdAsync(id);

//         if (post == null)
//         {
//             return NotFound();
//         }

//         // Map Post to PostDto
//         var postDto = new PostDto
//         {
//             Id = post.Id,
//             CommunityId = post.CommunityId,
//             UserId = post.UserId,
//             Title = post.Title,
//             Content = post.Content,
//             CreatedAt = post.CreatedAt,
//             UpdatedAt = post.UpdatedAt
//         };

//         return postDto;
//     }

//     [HttpGet("community/{communityId}")]
//     public async Task<ActionResult<IEnumerable<PostDto>>> GetPostsByCommunityId(Guid communityId)
//     {
//         var posts = await _postService.GetPostsByCommunityIdAsync(communityId);

//         var postDtos = posts.Select(post => new PostDto
//         {
//             Id = post.Id,
//             CommunityId = post.CommunityId,
//             UserId = post.UserId,
//             Title = post.Title,
//             Content = post.Content,
//             CreatedAt = post.CreatedAt,
//             UpdatedAt = post.UpdatedAt
//         });

//         return Ok(postDtos);
//     }

//     [HttpPost]
//     public async Task<ActionResult<PostDto>> CreatePost(CreatePostRequest request)
//     {
//         var post = new Post
//         {
//             CommunityId = request.CommunityId,
//             UserId = request.UserId,
//             Title = request.Title,
//             Content = request.Content
//         };

//         var createdPost = await _postService.CreatePostAsync(post);

//         if (createdPost == null)
//         {
//             return BadRequest();
//         }

//         // Map Post to PostDto
//         var postDto = new PostDto
//         {
//             Id = createdPost.Id,
//             CommunityId = createdPost.CommunityId,
//             UserId = createdPost.UserId,
//             Title = createdPost.Title,
//             Content = createdPost.Content,
//             CreatedAt = createdPost.CreatedAt,
//             UpdatedAt = createdPost.UpdatedAt
//         };

//         return CreatedAtAction(nameof(GetPost), new { id = postDto.Id }, postDto);
//     }

//     [HttpPut("{id}")]
//     public async Task<IActionResult> UpdatePost(Guid id, [FromBody] CreatePostRequest request)
//     {
//         var result = await _postService.UpdatePostAsync(id, request.Title, request.Content);

//         if (!result)
//         {
//             return NotFound();
//         }

//         return NoContent();
//     }

//     [HttpDelete("{id}")]
//     public async Task<IActionResult> DeletePost(Guid id)
//     {
//         var result = await _postService.DeletePostAsync(id);

//         if (!result)
//         {
//             return NotFound();
//         }

//         return NoContent();
//     }
// }