using Backend.Api.Modules.CommentService.Entities;

namespace Backend.Api.Modules.CommentService.Services;

public interface ICommentService
{
    Task<Comment?> GetCommentByIdAsync(Guid id);
    Task<List<Comment>> GetCommentsByPostIdAsync(Guid postId);
    Task<List<Comment>> GetRepliesByCommentIdAsync(Guid commentId);
    Task<Comment?> CreateCommentAsync(Comment comment);
    Task<bool> UpdateCommentAsync(Guid id, string content);
    Task<bool> DeleteCommentAsync(Guid id);
}