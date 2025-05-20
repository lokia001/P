using Backend.Api.Modules.AuthService.Entities;
using Backend.Api.Modules.UserService.Entities;
using Backend.Api.Modules.UserService.Models;
namespace Backend.Api.Modules.UserService.Services;

public interface IUserService
{
    Task CreatePasswordResetTokenAsync(User user, string token, DateTime expiresAt);

    Task<User?> AuthenticateAsync(string username, string password);  // Thêm method này
    Task<IEnumerable<User?>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(Guid userId);
    Task<bool> UpdateUserRoleAsync(Guid userId, Role newRole);
    Task<bool> DeleteUserAsync(Guid userId);
    // THÊM CÁC PHƯƠNG THỨC MỚI CHO ĐĂNG KÝ
    Task<bool> IsUsernameTakenAsync(string username);
    Task<bool> IsEmailTakenAsync(string email);
    Task<User?> RegisterUserAsync(User userToRegister); // Nhận User đã có PasswordHash

    Task<PasswordResetToken?> GetActivePasswordResetTokenByTokenValueAsync(string tokenValue);
    Task<bool> UpdateUserPasswordAsync(Guid userId, string newPasswordHash);
    Task MarkPasswordResetTokenAsUsedAsync(string tokenValue, Guid userId); // Thêm userId để tăng cường kiểm tra
    // old methods
    // Task<User?> AuthenticateAsync(string email, string password);  // Thêm method này

    // Task<User?> GetUserByIdAsync(Guid id);
    Task<User?> CreateUserAsync(User user);
    // Add other user-related operations
    Task<User?> RegisterUserAsync(RegisterRequest request);  // Add Register
    Task<bool> LogoutAsync(Guid userId);
    Task<User?> GetUserByEmailAsync(string email); // Thêm dòng này
    Task<bool> HasAnySysAdminAsync();
    // Task<List<User>> GetAllUsersAsync(); //Thêm
    Task<OwnerProfile> GetOwnerProfileByUserIdAsync(Guid userId);
    Task<OwnerProfile?> CreateOwnerProfileAsync(OwnerProfile ownerProfile);
}