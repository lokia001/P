using Backend.Api.Modules.PostService.Entities;
using Microsoft.EntityFrameworkCore;
using Backend.Api.Data;
namespace Backend.Api.Modules.PostService.Services;

public class PostService : IPostService
{
    private readonly AppDbContext _dbContext;

    public PostService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Post?> GetPostByIdAsync(Guid id)
    {
        // return await _dbContext.Posts.FindAsync(id);
        return null;
    }

    public async Task<List<Post>> GetPostsByCommunityIdAsync(Guid communityId)
    {
        // return await _dbContext.Posts.Where(p => p.CommunityId == communityId).ToListAsync();
        return null;
    }

    public async Task<Post?> CreatePostAsync(Post post)
    {
        // _dbContext.Posts.Add(post);
        await _dbContext.SaveChangesAsync();
        return post;
    }

    public async Task<bool> UpdatePostAsync(Guid id, string title, string? content)
    {
        // var post = await _dbContext.Posts.FindAsync(id);
        // if (post == null)
        // {
        //     return false;
        // }

        // post.Title = title;
        // post.Content = content;
        // post.UpdatedAt = DateTime.UtcNow;

        // _dbContext.Posts.Update(post);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeletePostAsync(Guid id)
    {
        // var post = await _dbContext.Posts.FindAsync(id);
        // if (post == null)
        // {
        //     return false;
        // }

        // _dbContext.Posts.Remove(post);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}