// Backend.Api/Services/Auth/JwtService.cs
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography; // Cho RandomNumberGenerator
using System.Text;
using Microsoft.Extensions.Configuration;
using Backend.Api.Modules.UserService.Entities; // Cho User (nếu phương thức GenerateToken cũ vẫn dùng)

namespace Backend.Api.Services.Auth
{
    public class JwtService
    {
        private readonly string _secretKey;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly IConfiguration _configuration; // Giữ lại IConfiguration

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
            _secretKey = configuration["Jwt:Key"] ?? throw new ArgumentNullException("Jwt:Key not configured");
            _issuer = configuration["Jwt:Issuer"] ?? throw new ArgumentNullException("Jwt:Issuer not configured");
            _audience = configuration["Jwt:Audience"] ?? throw new ArgumentNullException("Jwt:Audience not configured");
        }

        public string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_secretKey);
            var accessTokenExpiresInMinutes = _configuration.GetValue<int>("Jwt:AccessTokenExpiresInMinutes", 15); // Lấy từ config, mặc định 15 phút

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(accessTokenExpiresInMinutes),
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[64]; // Độ dài token (ví dụ 64 bytes -> 88 chars base64)
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, // Không cần validate audience khi chỉ muốn lấy principal
                ValidateIssuer = false,   // Không cần validate issuer khi chỉ muốn lấy principal
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_secretKey)),
                ValidateLifetime = false // QUAN TRỌNG: Cho phép token đã hết hạn
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
                if (!(securityToken is JwtSecurityToken jwtSecurityToken) ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return null; // Token không hợp lệ hoặc thuật toán không đúng
                }
                return principal;
            }
            catch
            {
                return null; // Token không thể validate
            }
        }
    }
}