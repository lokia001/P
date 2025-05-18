using Backend.Api.Modules.ReviewService.Entities;
using Microsoft.EntityFrameworkCore;
using Backend.Api.Data;
namespace Backend.Api.Modules.ReviewService.Services;

public class ReviewService : IReviewService
{
    private readonly AppDbContext _dbContext;

    public ReviewService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Review?> GetReviewByIdAsync(Guid id)
    {
        // return await _dbContext.Reviews.FindAsync(id);
        return null;
    }

    public async Task<List<Review>> GetReviewsBySpaceIdAsync(Guid spaceId)
    {
        return [];
    }

    public async Task<Review?> CreateReviewAsync(Review review)
    {
        // _dbContext.Reviews.Add(review);
        // await _dbContext.SaveChangesAsync();
        // return review;
        return null;
    }

    public async Task<bool> DeleteReviewAsync(Guid id)
    {
        // var review = await _dbContext.Reviews.FindAsync(id);
        // if (review == null)
        // {
        //     return false;
        // }

        // _dbContext.Reviews.Remove(review);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}