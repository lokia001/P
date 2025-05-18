using Backend.Api.Modules.PostService.Entities;

namespace Backend.Api.Modules.PostService.Services;

public interface IPostService
{
    Task<Post?> GetPostByIdAsync(Guid id);
    Task<List<Post>> GetPostsByCommunityIdAsync(Guid communityId);
    Task<Post?> CreatePostAsync(Post post);
    Task<bool> UpdatePostAsync(Guid id, string title, string? content);
    Task<bool> DeletePostAsync(Guid id);
}