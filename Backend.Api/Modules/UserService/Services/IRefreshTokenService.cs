using System;
using System.Threading.Tasks;
using Backend.Api.Modules.AuthService.Entities;
using Backend.Api.Modules.UserService.Entities;

namespace Backend.Api.Modules.AuthService.Services
{
    public interface IRefreshTokenService
    {
        Task<RefreshToken> CreateRefreshTokenAsync(User user, string ipAddress, string? deviceIdentifier = null);
        Task<RefreshToken?> GetByTokenAsync(string token);
        Task RevokeRefreshTokenAsync(string token, string ipAddress, string? reason = null, string? replacedByToken = null);
        Task RevokeDescendantRefreshTokensAsync(RefreshToken refreshToken, User user, string ipAddress, string reason);
        Task RemoveOldRefreshTokensAsync(Guid userId);
        User? GetUserFromRefreshToken(string token); // (Tùy chọn, có thể không cần nếu dùng GetByTokenAsync)
    }
}