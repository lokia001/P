// Backend.Api/Modules/AuthService/Controllers/AuthController.cs
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Api.Modules.UserService.Entities;
using Backend.Api.Modules.AuthService.Dtos;
using Backend.Api.Services.Auth;
using Backend.Api.Modules.UserService.Services;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;
using Backend.Api.Modules.UserService.Models;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Backend.Api.Modules.AuthService.Services; // Cho IRefreshTokenService
using Microsoft.Extensions.Configuration;
using Backend.Api.Modules.UserService.Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using Backend.Api.Services.Shared; // Cho IConfiguration

namespace Backend.Api.Modules.AuthService.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;
        private readonly JwtService _jwtService;
        private readonly IMapper _mapper;
        private readonly IRefreshTokenService _refreshTokenService; // Inject IRefreshTokenService
        private readonly IConfiguration _configuration; // Để lấy thời gian hết hạn access token
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IUserService userService,
            JwtService jwtService,
            IMapper mapper,
            IRefreshTokenService refreshTokenService,
             IEmailService emailService,             // Inject IEmailService
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _userService = userService;
            _jwtService = jwtService;
            _mapper = mapper;
            _refreshTokenService = refreshTokenService;
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger;
        }

        // POST /api/auth/forgot-password
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto forgotPasswordDto)

        {
            // Kiểm tra forgotPasswordDto null ngay từ đầu (mặc dù [ApiController] thường xử lý)
            if (forgotPasswordDto == null)
            {
                _logger.LogWarning("ForgotPassword request received with null body.");
                return BadRequest(new { error = "Request body cannot be empty." });
            }

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("ForgotPassword request with invalid model state for email: {Email}", forgotPasswordDto.Email);
                return BadRequest(ModelState);
            }

            _logger.LogInformation("Forgot password request received for email: {Email}", forgotPasswordDto.Email);

            User? user = null; // Khai báo user ở đây để có thể dùng trong catch
            var genericSuccessMessage = "If an account with this email address exists, instructions to reset your password have been sent.";

            try
            {
                user = await _userService.GetUserByEmailAsync(forgotPasswordDto.Email);

                if (user == null)
                {
                    _logger.LogInformation("Password reset requested for non-existent email: {Email}. Returning generic success message.", forgotPasswordDto.Email);
                    return Ok(new { message = genericSuccessMessage });
                }

                // Đảm bảo user.Email không null (dù GetUserByEmailAsync nên đảm bảo điều này)
                if (string.IsNullOrEmpty(user.Email))
                {
                    _logger.LogError("User object found for email {RequestedEmail} but user.Email property is null or empty. UserID: {UserId}", forgotPasswordDto.Email, user.Id);
                    return Ok(new { message = genericSuccessMessage + " (Internal data inconsistency. Please contact support.)" });
                }


                _logger.LogInformation("User found for password reset: {UserId}, Email: {UserEmail}", user.Id, user.Email);

                var resetTokenValue = GenerateSecureRandomString(64);
                // IConfiguration được inject, nên _configuration không nên null nếu DI đúng.
                var tokenExpiresInMinutes = _configuration.GetValue<int>("Auth:PasswordResetTokenExpiresInMinutes", 30);
                var expiresAt = DateTime.UtcNow.AddMinutes(tokenExpiresInMinutes);

                await _userService.CreatePasswordResetTokenAsync(user, resetTokenValue, expiresAt);
                _logger.LogInformation("Password reset token created for user {UserId}", user.Id);

                var frontendBaseUrl = _configuration["Auth:FrontendPasswordResetBaseUrl"];
                _logger.LogInformation("FrontendPasswordResetBaseUrl from config: '{FrontendBaseUrl}'", frontendBaseUrl);

                if (string.IsNullOrEmpty(frontendBaseUrl))
                {
                    _logger.LogError("CRITICAL: FrontendPasswordResetBaseUrl is not configured. Password reset email link will be incorrect.");
                    return Ok(new { message = genericSuccessMessage + " (Admin: Please configure FrontendPasswordResetBaseUrl)" });
                }

                var urlSafeToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(resetTokenValue));
                // Sử dụng user.Email đã được kiểm tra không null
                var resetLink = $"{frontendBaseUrl}?token={urlSafeToken}&email={Uri.EscapeDataString(user.Email)}";
                _logger.LogInformation("Generated reset link: {ResetLink}", resetLink);

                _logger.LogInformation("Attempting to send password reset email to {UserEmail} for user {UserId}...", user.Email, user.Id);

                // Sử dụng fallback cho recipientName nếu FullName và Username đều null
                string recipientNameForEmail = user.FullName ?? user.Username ?? "Valued User";
                await _emailService.SendPasswordResetEmailAsync(user.Email, recipientNameForEmail, resetLink);

                _logger.LogInformation("Password reset email (attempted to be) sent to {Email} for user {UserId}", user.Email, user.Id);
                return Ok(new { message = "Password reset instructions have been sent to your email address." });
            }
            catch (Exception ex)
            {
                // Sử dụng email từ request ban đầu hoặc từ user object nếu đã lấy được
                string emailForLogging = user?.Email ?? forgotPasswordDto.Email ?? "unknown_email_due_to_error_in_catch";
                _logger.LogError(ex, "Error occurred during forgot password process for email {Email} (User ID if found: {UserId}).", emailForLogging, user?.Id);
                return Ok(new { message = genericSuccessMessage + " (An internal error occurred. Please try again later.)" });
            }
        }


        // POST /api/auth/reset-password
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto resetPasswordDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 1. Decode token từ URL-safe Base64 (nếu bạn đã encode nó khi gửi email)
            string? decodedTokenValue;
            try
            {
                // Giả sử token gửi từ client là urlSafeToken đã được encode
                byte[] decodedBytes = WebEncoders.Base64UrlDecode(resetPasswordDto.Token);
                decodedTokenValue = Encoding.UTF8.GetString(decodedBytes);
            }
            catch (FormatException)
            {
                _logger.LogWarning("Invalid Base64Url format for password reset token: {Token}", resetPasswordDto.Token);
                return BadRequest(new { error = "invalid_token", message = "The password reset link is invalid or has been tampered with." });
            }

            if (string.IsNullOrEmpty(decodedTokenValue))
            {
                return BadRequest(new { error = "invalid_token", message = "Password reset token is missing or invalid." });
            }


            // 2. Truy vấn database để tìm mã đặt lại mật khẩu và kiểm tra tính hợp lệ
            var passwordResetToken = await _userService.GetActivePasswordResetTokenByTokenValueAsync(decodedTokenValue);

            if (passwordResetToken == null)
            {
                _logger.LogWarning("Password reset attempt with invalid or expired token: {DecodedToken}", decodedTokenValue);
                return BadRequest(new { error = "invalid_token", message = "Password reset token is invalid or has expired." });
            }

            // 3. (Quan trọng) Kiểm tra xem token có khớp với email được cung cấp không
            // User object đã được nạp cùng với passwordResetToken nhờ Include(prt => prt.User)
            if (passwordResetToken.User == null ||
                !string.Equals(passwordResetToken.User.Email, resetPasswordDto.Email, StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogWarning("Password reset token {DecodedToken} does not match the provided email {Email}.", decodedTokenValue, resetPasswordDto.Email);
                // Đây có thể là dấu hiệu của việc cố gắng lạm dụng token, hoặc người dùng nhầm lẫn.
                // Vẫn trả về lỗi token không hợp lệ chung chung.
                return BadRequest(new { error = "invalid_token", message = "Password reset token is invalid or does not match the provided email." });
            }

            // Token hợp lệ, tiến hành đặt lại mật khẩu
            try
            {
                // 4. Băm mật khẩu mới
                var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);

                // 5. Cập nhật mật khẩu cho người dùng
                var updateSuccess = await _userService.UpdateUserPasswordAsync(passwordResetToken.UserId, newPasswordHash);

                if (!updateSuccess)
                {
                    // Trường hợp này hiếm khi xảy ra nếu token hợp lệ và user tồn tại
                    _logger.LogError("Failed to update password for user {UserId} after validating reset token.", passwordResetToken.UserId);
                    return StatusCode(500, new { error = "server_error", message = "An unexpected error occurred while resetting your password. Please try again." });
                }

                // 6. Vô hiệu hóa mã đặt lại mật khẩu đã sử dụng
                await _userService.MarkPasswordResetTokenAsUsedAsync(decodedTokenValue, passwordResetToken.UserId);

                _logger.LogInformation("Password successfully reset for user {UserId} using token {DecodedToken}", passwordResetToken.UserId, decodedTokenValue);
                return Ok(new { message = "Your password has been reset successfully. You can now log in with your new password." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during password reset process for user {UserId} with token {DecodedToken}", passwordResetToken.UserId, decodedTokenValue);
                return StatusCode(500, new { error = "server_error", message = "An unexpected error occurred. Please try again." });
            }
        }


        private string GenerateSecureRandomString(int length)
        {
            // Tạo một chuỗi base64 ngẫu nhiên, an toàn cho URL
            var randomNumber = new byte[length * 3 / 4 + (length % 4 == 0 ? 0 : 1)]; // Tính toán kích thước byte cần thiết cho độ dài base64 mong muốn
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                // Chuyển thành Base64 và loại bỏ các ký tự không an toàn cho URL
                return Convert.ToBase64String(randomNumber)
                              .TrimEnd('=') // Bỏ các ký tự padding '='
                              .Replace('+', '-') // Thay '+' bằng '-'
                              .Replace('/', '_'); // Thay '/' bằng '_'
            }
        }


        // 1. Endpoint Đăng nhập (/api/auth/login - POST) - CẬP NHẬT
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequest)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            User? authenticatedUser = await _userService.AuthenticateAsync(loginRequest.Username, loginRequest.Password);
            if (authenticatedUser == null)
            {
                return Unauthorized(new { error = "Invalid credentials" });
            }

            // Tạo claims cho Access Token
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, authenticatedUser.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, authenticatedUser.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // JTI cho Access Token
                new Claim("Username", authenticatedUser.Username),
                new Claim("FullName", authenticatedUser.FullName ?? string.Empty),
                new Claim("UserRole", authenticatedUser.Role.ToString()),
                new Claim(ClaimTypes.Role, authenticatedUser.Role.ToString())
            };
            // ... (thêm các claims khác như PhoneNumber, AvatarUrl, OwnerProfileId nếu có) ...
            if (!string.IsNullOrEmpty(authenticatedUser.PhoneNumber)) claims.Add(new Claim(ClaimTypes.MobilePhone, authenticatedUser.PhoneNumber));
            if (!string.IsNullOrEmpty(authenticatedUser.AvatarUrl)) claims.Add(new Claim("AvatarUrl", authenticatedUser.AvatarUrl));
            if (authenticatedUser.Role == Role.Owner && authenticatedUser.OwnerProfile != null) claims.Add(new Claim("OwnerProfileId", authenticatedUser.OwnerProfile.UserId.ToString()));


            var accessToken = _jwtService.GenerateAccessToken(claims);
            var accessTokenExpiresInMinutes = _configuration.GetValue<int>("Jwt:AccessTokenExpiresInMinutes", 15);
            var accessTokenExpiresAt = DateTime.UtcNow.AddMinutes(accessTokenExpiresInMinutes);

            // Tạo Refresh Token và lưu vào DB
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var refreshToken = await _refreshTokenService.CreateRefreshTokenAsync(authenticatedUser, ipAddress /*, deviceIdentifier */);

            var userDto = _mapper.Map<UserDto>(authenticatedUser);

            return Ok(new LoginResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken.Token, // Trả về giá trị chuỗi của refresh token
                User = userDto,
                AccessTokenExpiresAt = accessTokenExpiresAt
            });
        }

        // 2. Endpoint Làm mới Token (/api/auth/refresh-token - POST) - MỚI
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            if (string.IsNullOrEmpty(request.RefreshToken))
                return BadRequest(new { error = "Refresh token is required." });

            var storedRefreshToken = await _refreshTokenService.GetByTokenAsync(request.RefreshToken);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            if (storedRefreshToken == null)
                return Unauthorized(new { error = "Invalid refresh token." });

            if (storedRefreshToken.RevokedAt != null)
            {
                // Token đã bị thu hồi. Thu hồi tất cả các token con cháu của nó để ngăn chặn tấn công replay.
                _logger.LogWarning("Attempt to use revoked refresh token {Token} from IP {IPAddress} for User {UserId}. Revoking descendant tokens.", request.RefreshToken, ipAddress, storedRefreshToken.UserId);
                await _refreshTokenService.RevokeDescendantRefreshTokensAsync(storedRefreshToken, storedRefreshToken.User, ipAddress, "Attempted use of revoked token");
                return Unauthorized(new { error = "Refresh token has been revoked." });
            }

            if (storedRefreshToken.ExpiresAt < DateTime.UtcNow)
                return Unauthorized(new { error = "Refresh token has expired." });

            // Token hợp lệ, tạo access token mới và refresh token mới (xoay vòng token)
            var user = storedRefreshToken.User;
            if (user == null) // Nên luôn có User nếu Include đúng cách
            {
                _logger.LogError("User not found for valid refresh token {Token}. Data integrity issue?", request.RefreshToken);
                return Unauthorized(new { error = "Invalid token state." });
            }

            // Tạo claims mới cho access token
            var newClaims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("Username", user.Username),
                new Claim("FullName", user.FullName ?? string.Empty),
                new Claim("UserRole", user.Role.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };
            // ... (thêm các claims khác nếu cần) ...
            if (!string.IsNullOrEmpty(user.PhoneNumber)) newClaims.Add(new Claim(ClaimTypes.MobilePhone, user.PhoneNumber));
            if (!string.IsNullOrEmpty(user.AvatarUrl)) newClaims.Add(new Claim("AvatarUrl", user.AvatarUrl));
            if (user.Role == Role.Owner && user.OwnerProfile != null) newClaims.Add(new Claim("OwnerProfileId", user.OwnerProfile.UserId.ToString()));


            var newAccessToken = _jwtService.GenerateAccessToken(newClaims);
            var accessTokenExpiresInMinutes = _configuration.GetValue<int>("Jwt:AccessTokenExpiresInMinutes", 15);
            var newAccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(accessTokenExpiresInMinutes);


            // Tạo refresh token MỚI
            var newRefreshToken = await _refreshTokenService.CreateRefreshTokenAsync(user, ipAddress);

            // Thu hồi refresh token CŨ (đánh dấu là đã được thay thế)
            await _refreshTokenService.RevokeRefreshTokenAsync(storedRefreshToken.Token, ipAddress, "Replaced by new token", newRefreshToken.Token);

            // (Tùy chọn) Xóa các refresh token cũ của user này
            await _refreshTokenService.RemoveOldRefreshTokensAsync(user.Id);


            return Ok(new LoginResponseDto // Trả về cấu trúc giống LoginResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken.Token,
                User = _mapper.Map<UserDto>(user), // Có thể không cần trả lại User info ở đây
                AccessTokenExpiresAt = newAccessTokenExpiresAt
            });
        }


        // 3. Endpoint Đăng xuất (/api/auth/logout - POST) - CẬP NHẬT
        [HttpPost("logout")]
        [Authorize] // Yêu cầu xác thực để biết user nào đang logout
        public async Task<IActionResult> Logout([FromBody] RevokeTokenRequestDto? request) // Nhận refresh token để thu hồi
        {
            // Cách 1: Client gửi refresh token để thu hồi (khuyến nghị)
            if (request == null || string.IsNullOrEmpty(request.Token))
            {
                // Nếu client không gửi refresh token, chúng ta không thể thu hồi nó một cách cụ thể.
                // Chúng ta vẫn có thể ghi log logout dựa trên access token.
                var userIdFromAccessToken = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                _logger.LogInformation("User {UserId} (from Access Token) initiated logout without providing a refresh token to revoke.", userIdFromAccessToken ?? "Unknown");
                return Ok(new { message = "Logout signal received. Client should clear tokens. No specific refresh token revoked." });
            }

            var refreshTokenToRevoke = await _refreshTokenService.GetByTokenAsync(request.Token);
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            if (refreshTokenToRevoke != null && refreshTokenToRevoke.IsActive)
            {
                // Kiểm tra xem refresh token có thuộc về user đang đăng nhập không (nếu cần bảo mật thêm)
                var userIdFromClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
                if (userIdFromClaim != null && refreshTokenToRevoke.UserId.ToString() == userIdFromClaim)
                {
                    await _refreshTokenService.RevokeRefreshTokenAsync(refreshTokenToRevoke.Token, ipAddress, "User logged out");
                    _logger.LogInformation("User {UserId} logged out and refresh token {Token} revoked.", refreshTokenToRevoke.UserId, refreshTokenToRevoke.Token);
                    return Ok(new { message = "Logout successful and refresh token revoked." });
                }
                else
                {
                    _logger.LogWarning("User {UserIdClaim} attempted to revoke refresh token {Token} not belonging to them or token already inactive.", userIdFromClaim, request.Token);
                    return BadRequest(new { error = "Invalid refresh token or permission denied." });
                }
            }
            _logger.LogWarning("Attempted to logout with invalid or already inactive refresh token: {Token}", request.Token);
            return Ok(new { message = "Logout processed. If token was valid, it has been revoked." }); // Trả về OK để client vẫn xóa token
        }


        // POST /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationDto registrationDto)
        {
            // 1. Nhận dữ liệu đăng ký (đã được model binding vào registrationDto)
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 2. Xác thực dữ liệu
            if (await _userService.IsUsernameTakenAsync(registrationDto.Username))
            {
                // Thêm lỗi vào ModelState để trả về thông báo chuẩn hơn
                ModelState.AddModelError(nameof(registrationDto.Username), "Username is already taken.");
                _logger.LogWarning("Registration failed: Username {Username} already taken.", registrationDto.Username);
                return BadRequest(ModelState); // Hoặc return Conflict()
            }

            if (await _userService.IsEmailTakenAsync(registrationDto.Email))
            {
                ModelState.AddModelError(nameof(registrationDto.Email), "Email is already registered.");
                _logger.LogWarning("Registration failed: Email {Email} already registered.", registrationDto.Email);
                return BadRequest(ModelState); // Hoặc return Conflict()
            }

            // (Thực hiện các validation khác nếu cần, ví dụ: độ phức tạp mật khẩu ở đây nếu không dùng attribute)

            // 3. Tạo đối tượng User mới
            var newUser = new User
            {
                Id = Guid.NewGuid(),
                Username = registrationDto.Username,
                Email = registrationDto.Email,
                FullName = registrationDto.FullName,
                // Quan trọng: Hash mật khẩu
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password),
                Role = Role.User, // Vai trò mặc định khi đăng ký
                CreatedAt = DateTime.UtcNow,
                PhoneNumber = registrationDto.PhoneNumber, // Nếu có
                                                           // Các thuộc tính mặc định khác nếu cần
                                                           // EmailConfirmed = false, // Thường là false, cần quy trình xác thực email
            };

            try
            {
                // 4. Lưu người dùng vào database
                // Giả sử RegisterUserAsync trong IUserService sẽ gọi AddAsync và SaveChangesAsync
                // và trả về User đã được tạo (hoặc null nếu có lỗi)
                // Hoặc bạn có thể có một phương thức CreateUserAsync(User user)
                var createdUser = await _userService.RegisterUserAsync(newUser); // Hoặc CreateUserAsync(newUser)

                if (createdUser == null)
                {
                    _logger.LogError("Registration failed: Could not save user {Username} to database.", newUser.Username);
                    return BadRequest(new { error = "An error occurred during registration. Please try again." });
                }

                _logger.LogInformation("User {Username} registered successfully with ID {UserId}.", createdUser.Username, createdUser.Id);

                // 5. Trả về response thành công
                // Tùy chọn: Trả về thông tin người dùng đã tạo (map sang DTO)
                // hoặc chỉ một thông báo thành công.
                // Trả về 201 Created với URI của resource mới (nếu có endpoint GetUserById)
                // và đối tượng UserDto.

                var userDto = _mapper.Map<UserDto>(createdUser); // Map sang UserDto để không lộ PasswordHash

                // Giả sử bạn có một action GetUserById trong UsersController hoặc AdminController
                // return CreatedAtAction(nameof(UsersController.GetUserById), "Users", new { id = createdUser.Id }, userDto);
                // Nếu không có endpoint GetUserById cụ thể, hoặc muốn đơn giản:
                return StatusCode(201, userDto); // HTTP 201 Created
                                                 // Hoặc chỉ một thông báo:
                                                 // return StatusCode(201, new { message = "User registered successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred during user registration for {Username}.", registrationDto.Username);
                // 6. Trả về response lỗi
                return StatusCode(500, new { error = "An internal server error occurred during registration." });
            }
        }
    }
}



