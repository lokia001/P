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
            var utcNow = DateTime.UtcNow; // Lấy thời gian hiện tại một lần
            var oldTokenRemovalDays = _configuration.GetValue<int>("Jwt:OldRefreshTokenRemovalDays", 30);
            var removalCutoffDate = utcNow.AddDays(-oldTokenRemovalDays);

            // =======================================================================
            // FIX: SỬA LẠI TRUY VẤN LINQ ĐỂ DÙNG CÁC THUỘC TÍNH ĐƯỢC MAP
            // Điều kiện để token được coi là "old" và cần xóa:
            // 1. Nó đã bị thu hồi (RevokedAt != null)
            // HOẶC 2. Nó đã hết hạn (ExpiresAt < utcNow)
            // HOẶC 3. Nó đã quá cũ theo định nghĩa (ExpiresAt < removalCutoffDate) - điều kiện này bao hàm cả token đã hết hạn.
            // Chúng ta muốn xóa các token không còn active (đã thu hồi HOẶC đã hết hạn)
            // HOẶC những token (kể cả còn active) nhưng đã quá "tuổi" (ExpiresAt rất xa trong quá khứ).
            // Điều kiện `!rt.IsActive` tương đương với `(rt.RevokedAt != null || rt.ExpiresAt < utcNow)`
            // =======================================================================
            var oldTokens = await _dbContext.RefreshTokens
                .Where(rt => rt.UserId == userId &&
                             (
                                 (rt.RevokedAt != null || rt.ExpiresAt < utcNow) // Token không còn active
                                 || // HOẶC
                                 rt.ExpiresAt < removalCutoffDate // Token quá cũ (ngay cả nếu nó chưa bị revoke và ExpiresAt > utcNow nhưng vẫn < removalCutoffDate)
                                                                  // Điều kiện này thực ra đã bao gồm rt.ExpiresAt < utcNow
                                                                  // Nên có thể đơn giản hóa thành:
                                                                  // (rt.RevokedAt != null || rt.ExpiresAt < removalCutoffDate)
                             )
                )
                .ToListAsync();

            // Đơn giản hóa điều kiện hơn nữa:
            // Chúng ta muốn xóa token nếu:
            // - Nó đã bị thu hồi (RevokedAt có giá trị)
            // - HOẶC nó đã hết hạn theo nghĩa thông thường (ExpiresAt < utcNow)
            // - HOẶC nó được tạo ra quá lâu rồi (ngay cả khi ExpiresAt của nó được đặt rất xa trong tương lai,
            //   nhưng nếu nó không được dùng và CreatedAt < removalCutoffDate thì cũng có thể xóa).
            //   Tuy nhiên, logic hiện tại của bạn dựa trên ExpiresAt để xác định "cũ".

            // Giữ logic gần với ý định ban đầu của bạn: Xóa token không active HOẶC token có ExpiresAt quá cũ.
            // Token không active: RevokedAt != null HOẶC ExpiresAt < utcNow
            // Token có ExpiresAt quá cũ: ExpiresAt < removalCutoffDate
            // Kết hợp lại: (RevokedAt != null || ExpiresAt < utcNow) || ExpiresAt < removalCutoffDate
            // Vì removalCutoffDate < utcNow, nên ExpiresAt < removalCutoffDate cũng có nghĩa là ExpiresAt < utcNow.
            // Vậy điều kiện có thể là: RevokedAt != null || ExpiresAt < removalCutoffDate

            // SỬA LẠI TRUY VẤN CHO CHÍNH XÁC:
            var tokensToRemove = await _dbContext.RefreshTokens
                .Where(rt => rt.UserId == userId &&
                             (rt.RevokedAt != null || rt.ExpiresAt < removalCutoffDate)
                )
                .ToListAsync();
            // =======================================================================


            if (tokensToRemove.Any()) // Sử dụng biến mới tokensToRemove
            {
                _dbContext.RefreshTokens.RemoveRange(tokensToRemove);
                await _dbContext.SaveChangesAsync();
                _logger.LogInformation("Removed {Count} old/inactive refresh tokens for User {UserId}", tokensToRemove.Count, userId);
            }
            else
            {
                _logger.LogInformation("No old/inactive refresh tokens found to remove for User {UserId}", userId);
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