// Backend.Api/Modules/AuthService/Services/RefreshTokenService.cs
using Backend.Api.Data; // Cho AppDbContext
using Backend.Api.Modules.AuthService.Entities;
using Backend.Api.Modules.UserService.Entities;
using Backend.Api.Services.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration; // Cho IConfiguration
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Backend.Api.Modules.AuthService.Services
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly AppDbContext _dbContext;
        private readonly JwtService _jwtService; // Để tạo chuỗi refresh token
        private readonly IConfiguration _configuration;
        private readonly ILogger<RefreshTokenService> _logger;

        public RefreshTokenService(
            AppDbContext dbContext,
            JwtService jwtService,
            IConfiguration configuration,
            ILogger<RefreshTokenService> logger)
        {
            _dbContext = dbContext;
            _jwtService = jwtService;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<RefreshToken> CreateRefreshTokenAsync(User user, string ipAddress, string? deviceIdentifier = null)
        {
            var refreshTokenValue = _jwtService.GenerateRefreshToken(); // Tạo chuỗi token ngẫu nhiên
            var refreshTokenExpiresInDays = _configuration.GetValue<int>("Jwt:RefreshTokenExpiresInDays", 7);

            var refreshToken = new RefreshToken
            {
                UserId = user.Id,
                Token = refreshTokenValue,
                ExpiresAt = DateTime.UtcNow.AddDays(refreshTokenExpiresInDays),
                CreatedAt = DateTime.UtcNow,
                IpAddress = ipAddress,
                DeviceIdentifier = deviceIdentifier
            };

            await _dbContext.RefreshTokens.AddAsync(refreshToken);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("Created refresh token for User {UserId} on IP {IPAddress}", user.Id, ipAddress);
            return refreshToken;
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            return await _dbContext.RefreshTokens
                .Include(rt => rt.User) // Quan trọng: Nạp thông tin User
                .SingleOrDefaultAsync(rt => rt.Token == token);
        }

        public async Task RevokeRefreshTokenAsync(string token, string ipAddress, string? reason = null, string? replacedByToken = null)
        {
            var refreshToken = await _dbContext.RefreshTokens.SingleOrDefaultAsync(rt => rt.Token == token);
            if (refreshToken == null || !refreshToken.IsActive)
                return; // Token không tồn tại hoặc đã không active

            refreshToken.RevokedAt = DateTime.UtcNow;
            // refreshToken.RevokedByIp = ipAddress; // Nếu bạn có trường này
            refreshToken.ReplacedByToken = replacedByToken;
            // refreshToken.ReasonRevoked = reason; // Nếu có trường này

            _dbContext.RefreshTokens.Update(refreshToken);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("Revoked refresh token {Token} for reason: {Reason}", token, reason ?? "N/A");
        }

        // Thu hồi một token và tất cả các token "con cháu" của nó (nếu dùng cơ chế xoay vòng token)
        public async Task RevokeDescendantRefreshTokensAsync(RefreshToken refreshToken, User user, string ipAddress, string reason)
        {
            // Nếu token này không có token thay thế, không có gì để làm
            if (string.IsNullOrEmpty(refreshToken.ReplacedByToken))
                return;

            var childToken = await _dbContext.RefreshTokens
                                        .SingleOrDefaultAsync(x => x.Token == refreshToken.ReplacedByToken);

            if (childToken != null && childToken.IsActive && childToken.UserId == user.Id)
            {
                await RevokeRefreshTokenAsync(childToken.Token, ipAddress, reason);
                await RevokeDescendantRefreshTokensAsync(childToken, user, ipAddress, reason); // Đệ quy
            }
        }


        public async Task RemoveOldRefreshTokensAsync(Guid userId)
        {
            // Xóa các refresh token đã hết hạn hoặc đã bị thu hồi của user
            var oldTokens = await _dbContext.RefreshTokens
                .Where(rt => rt.UserId == userId && (!rt.IsActive || rt.ExpiresAt < DateTime.UtcNow.AddDays(-_configuration.GetValue<int>("Jwt:OldRefreshTokenRemovalDays", 30)))) // Ví dụ: xóa token cũ hơn 30 ngày
                .ToListAsync();

            if (oldTokens.Any())
            {
                _dbContext.RefreshTokens.RemoveRange(oldTokens);
                await _dbContext.SaveChangesAsync();
                _logger.LogInformation("Removed {Count} old refresh tokens for User {UserId}", oldTokens.Count, userId);
            }
        }

        public User? GetUserFromRefreshToken(string token) // Có thể không cần nếu GetByTokenAsync đã Include User
        {
            var refreshToken = _dbContext.RefreshTokens
                                    .Include(rt => rt.User)
                                    .SingleOrDefault(rt => rt.Token == token);
            return refreshToken?.User;
        }
    }
}