using Backend.Api.Modules.CommentService.Entities;
using Microsoft.EntityFrameworkCore;
using Backend.Api.Data;
namespace Backend.Api.Modules.CommentService.Services;

public class CommentService : ICommentService
{
    private readonly AppDbContext _dbContext;

    public CommentService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Comment?> GetCommentByIdAsync(Guid id)
    {
        // return await _dbContext.Comments.FindAsync(id);
        return null;
    }

    public async Task<List<Comment>> GetCommentsByPostIdAsync(Guid postId)
    {
        // return await _dbContext.Comments.Where(c => c.PostId == postId && c.ParentCommentId == null).ToListAsync(); // Only top-level comments
        return null;
    }

    public async Task<List<Comment>> GetRepliesByCommentIdAsync(Guid commentId)
    {
        // return await _dbContext.Comments.Where(c => c.ParentCommentId == commentId).ToListAsync();
        return null;
    }

    public async Task<Comment?> CreateCommentAsync(Comment comment)
    {
        // _dbContext.Comments.Add(comment);
        await _dbContext.SaveChangesAsync();
        return comment;
    }

    public async Task<bool> UpdateCommentAsync(Guid id, string content)
    {
        // var comment = await _dbContext.Comments.FindAsync(id);
        // if (comment == null)
        // {
        //     return false;
        // }

        // comment.Content = content;
        // comment.UpdatedAt = DateTime.UtcNow;

        // _dbContext.Comments.Update(comment);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteCommentAsync(Guid id)
    {
        // var comment = await _dbContext.Comments.FindAsync(id);
        // if (comment == null)
        // {
        //     return false;
        // }

        // _dbContext.Comments.Remove(comment);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}