using Backend.Api.Modules.ReviewService.Entities;

namespace Backend.Api.Modules.ReviewService.Services;

public interface IReviewService
{
    Task<Review?> GetReviewByIdAsync(Guid id);
    Task<List<Review>> GetReviewsBySpaceIdAsync(Guid spaceId);
    Task<Review?> CreateReviewAsync(Review review);
    Task<bool> DeleteReviewAsync(Guid id);
}