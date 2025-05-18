// Backend.Api/Modules/ReviewService/Controllers/ReviewsController.cs
using Microsoft.AspNetCore.Mvc;
using Backend.Api.Modules.ReviewService.Models;
using System;
using Backend.Api.Modules.ReviewService.Entities;

namespace Backend.Api.Modules.ReviewService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetReviews(int count = 10)
    {

        return null;
    }
}

// using Backend.Api.Modules.ReviewService.Entities;
// using Backend.Api.Modules.ReviewService.Models;
// using Backend.Api.Modules.ReviewService.Services;
// using Microsoft.AspNetCore.Mvc;

// namespace Backend.Api.Modules.ReviewService.Controllers;

// [ApiController]
// [Route("api/[controller]")]
// public class ReviewsController : ControllerBase
// {
//     private readonly IReviewService _reviewService;

//     public ReviewsController(IReviewService reviewService)
//     {
//         _reviewService = reviewService;
//     }

//     [HttpGet("{id}")]
//     public async Task<ActionResult<ReviewDto>> GetReview(Guid id)
//     {
//         var review = await _reviewService.GetReviewByIdAsync(id);

//         if (review == null)
//         {
//             return NotFound();
//         }

//         // Map Review to ReviewDto
//         var reviewDto = new ReviewDto
//         {
//             Id = review.Id,
//             SpaceId = review.SpaceId,
//             UserId = review.UserId,
//             BookingId = review.BookingId,
//             Rating = review.Rating,
//             Comment = review.Comment,
//             CreatedAt = review.CreatedAt
//         };

//         return reviewDto;
//     }

//     [HttpGet("space/{spaceId}")]
//     public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsBySpaceId(Guid spaceId)
//     {
//         var reviews = await _reviewService.GetReviewsBySpaceIdAsync(spaceId);

//         var reviewDtos = reviews.Select(review => new ReviewDto
//         {
//             Id = review.Id,
//             SpaceId = review.SpaceId,
//             UserId = review.UserId,
//             BookingId = review.BookingId,
//             Rating = review.Rating,
//             Comment = review.Comment,
//             CreatedAt = review.CreatedAt
//         });

//         return Ok(reviewDtos);
//     }

//     [HttpPost]
//     public async Task<ActionResult<ReviewDto>> CreateReview(CreateReviewRequest request)
//     {
//         var review = new Review
//         {
//             SpaceId = request.SpaceId,
//             UserId = request.UserId,
//             BookingId = request.BookingId,
//             Rating = request.Rating,
//             Comment = request.Comment
//         };

//         var createdReview = await _reviewService.CreateReviewAsync(review);

//         if (createdReview == null)
//         {
//             return BadRequest();
//         }

//         // Map Review to ReviewDto
//         var reviewDto = new ReviewDto
//         {
//             Id = createdReview.Id,
//             SpaceId = createdReview.SpaceId,
//             UserId = createdReview.UserId,
//             BookingId = createdReview.BookingId,
//             Rating = createdReview.Rating,
//             Comment = createdReview.Comment,
//             CreatedAt = createdReview.CreatedAt
//         };

//         return CreatedAtAction(nameof(GetReview), new { id = reviewDto.Id }, reviewDto);
//     }

//     [HttpDelete("{id}")]
//     public async Task<IActionResult> DeleteReview(Guid id)
//     {
//         var result = await _reviewService.DeleteReviewAsync(id);

//         if (!result)
//         {
//             return NotFound();
//         }

//         return NoContent();
//     }
// }