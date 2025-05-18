// using Backend.Api.Modules.UserService.Data;
using Backend.Api.Modules.UserService.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging; // Thêm using
using System;
using BCrypt.Net; // Thêm using cho BCrypt
using Backend.Api.Data;
using Backend.Api.Modules.UserService.Models;

namespace Backend.Api.Modules.UserService.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<UserService> _logger;  //Thêm logging

    public UserService(AppDbContext dbContext, ILogger<UserService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    // --- Phương thức cho AuthController ---
    public async Task<User?> AuthenticateAsync(string username, string password)
    {
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            return null;

        // Tìm người dùng theo username (có thể là username hoặc email tùy theo logic của bạn)
        // Ở đây giả sử tìm theo Username
        var user = await _dbContext.Users
                               .Include(u => u.OwnerProfile) // Include OwnerProfile để lấy thông tin nếu là Owner
                               .AsNoTracking() // Không cần theo dõi thay đổi cho việc xác thực
                               .SingleOrDefaultAsync(u => u.Username == username);

        if (user == null)
        {
            _logger.LogWarning("Authentication failed: User {Username} not found.", username);
            return null; // Không tìm thấy username
        }

        // Kiểm tra mật khẩu
        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            _logger.LogWarning("Authentication failed: Invalid password for user {Username}.", username);
            // TODO: Cân nhắc việc tăng số lần đăng nhập thất bại (nếu có cơ chế lockout)
            return null; // Sai mật khẩu
        }

        // Xác thực thành công
        _logger.LogInformation("User {Username} authenticated successfully.", username);
        return user;
    }

    // --- Các phương thức cho AdminController ---

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        // Nếu bạn muốn trả về UserDto trực tiếp từ service:
        // var users = await _dbContext.Users.AsNoTracking().ToListAsync();
        // return _mapper.Map<IEnumerable<UserDto>>(users);
        _logger.LogInformation("Fetching all users.");
        return await _dbContext.Users
                            .Include(u => u.OwnerProfile) // Include OwnerProfile để có thông tin đầy đủ
                            .AsNoTracking()
                            .ToListAsync();
    }


    public async Task<bool> IsUsernameTakenAsync(string username)
    {
        if (string.IsNullOrWhiteSpace(username)) return false; // Hoặc throw ArgumentNullException
        return await _dbContext.Users.AnyAsync(u => u.Username.ToLower() == username.ToLower());
    }

    public async Task<bool> IsEmailTakenAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        return await _dbContext.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower());
    }

    // Giả định phương thức này nhận User đã được hash mật khẩu từ controller
    public async Task<User?> RegisterUserAsync(User userToRegister)
    {
        if (userToRegister == null)
            throw new ArgumentNullException(nameof(userToRegister));

        // Kiểm tra lại tính duy nhất trước khi thêm (đề phòng race condition, mặc dù controller đã kiểm tra)
        if (await IsUsernameTakenAsync(userToRegister.Username))
        {
            _logger.LogError("Registration in service failed: Username {Username} is already taken (race condition or direct service call).", userToRegister.Username);
            return null; // Hoặc throw một exception cụ thể
        }
        if (await IsEmailTakenAsync(userToRegister.Email))
        {
            _logger.LogError("Registration in service failed: Email {Email} is already taken (race condition or direct service call).", userToRegister.Email);
            return null; // Hoặc throw một exception cụ thể
        }

        try
        {
            await _dbContext.Users.AddAsync(userToRegister);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("User {Username} (ID: {UserId}) successfully saved to database by service.", userToRegister.Username, userToRegister.Id);
            return userToRegister; // Trả về user đã được lưu (có thể có các giá trị được DB generate)
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError(dbEx, "Database error occurred while registering user {Username}.", userToRegister.Username);
            // Xử lý các lỗi cụ thể từ DbUpdateException nếu cần (ví dụ: lỗi unique constraint)
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Generic error occurred while registering user {Username}.", userToRegister.Username);
            return null;
        }
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        // Nếu bạn muốn trả về UserDto trực tiếp từ service:
        // var user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
        // return user == null ? null : _mapper.Map<UserDto>(user);
        _logger.LogInformation("Fetching user by ID: {UserId}", userId);
        return await _dbContext.Users
                            .Include(u => u.OwnerProfile)
                            .AsNoTracking()
                            .FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<bool> UpdateUserRoleAsync(Guid userId, Role newRole)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("UpdateUserRole failed: User with ID {UserId} not found.", userId);
            return false; // Không tìm thấy người dùng
        }

        // Kiểm tra xem vai trò mới có khác vai trò hiện tại không
        if (user.Role == newRole)
        {
            _logger.LogInformation("User {UserId} already has role {Role}. No update needed.", userId, newRole);
            return true; // Không có gì để cập nhật, coi như thành công
        }

        // Đặc biệt cẩn thận khi thay đổi vai trò thành SysAdmin hoặc gỡ vai trò SysAdmin
        // Có thể bạn muốn thêm logic kiểm tra quyền hạn ở đây
        // Ví dụ: không cho phép gỡ vai trò SysAdmin của user SysAdmin cuối cùng
        if (user.Role == Role.SysAdmin && newRole != Role.SysAdmin)
        {
            var sysAdminCount = await _dbContext.Users.CountAsync(u => u.Role == Role.SysAdmin);
            if (sysAdminCount <= 1)
            {
                _logger.LogWarning("UpdateUserRole failed: Cannot remove the last SysAdmin role from user {UserId}.", userId);
                // throw new InvalidOperationException("Cannot remove the last SysAdmin role."); // Hoặc trả về false
                return false;
            }
        }

        user.Role = newRole;
        user.UpdatedAt = DateTime.UtcNow;

        _dbContext.Users.Update(user);
        try
        {
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("Role for user {UserId} updated to {NewRole}.", userId, newRole);
            return true;
        }
        catch (DbUpdateConcurrencyException ex)
        {
            _logger.LogError(ex, "Concurrency error while updating role for user {UserId}.", userId);
            // Xử lý concurrency error nếu cần
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating role for user {UserId}.", userId);
            return false;
        }
    }

    public async Task<bool> DeleteUserAsync(Guid userId)
    {
        var user = await _dbContext.Users.FindAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("DeleteUser failed: User with ID {UserId} not found.", userId);
            return false; // Không tìm thấy người dùng
        }

        // QUAN TRỌNG: Không cho phép xóa SysAdmin (hoặc SysAdmin cuối cùng)
        if (user.Role == Role.SysAdmin)
        {
            // Kiểm tra xem có phải là SysAdmin cuối cùng không
            var sysAdminCount = await _dbContext.Users.CountAsync(u => u.Role == Role.SysAdmin);
            if (sysAdminCount <= 1)
            {
                _logger.LogWarning("DeleteUser failed: Cannot delete the last SysAdmin user (ID: {UserId}).", userId);
                // throw new InvalidOperationException("Cannot delete the last SysAdmin user.");
                return false; // Ngăn chặn việc xóa
            }
        }

        // Cân nhắc về soft delete thay vì hard delete
        // Nếu là hard delete:
        _dbContext.Users.Remove(user);
        try
        {
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation("User with ID {UserId} deleted successfully.", userId);
            return true;
        }
        catch (DbUpdateException ex) // Bắt lỗi liên quan đến ràng buộc khóa ngoại
        {
            _logger.LogError(ex, "Error deleting user {UserId} due to database constraints. User might have related data (bookings, posts, etc.).", userId);
            // Ví dụ: nếu User có Bookings và bạn không cấu hình Cascade Delete hoặc SetNull,
            // việc xóa User sẽ thất bại nếu có Booking liên quan.
            // Bạn cần xử lý các dữ liệu liên quan này trước khi xóa User (ví dụ: xóa Bookings, gán lại BookerId, etc.)
            // hoặc cấu hình OnDelete behavior trong EF Core.
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {UserId}.", userId);
            return false;
        }
    }
    // old methods
    // public async Task<User?> AuthenticateAsync(string email, string password)
    // {
    //     try
    //     {
    //         var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
    //         if (user == null)
    //         {
    //             _logger.LogWarning($"Authentication failed: User not found with email {email}");
    //             return null;
    //         }

    //         // Verify password (use hashing in real application)
    //         if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
    //         {
    //             _logger.LogWarning($"Authentication failed: Incorrect password for email {email}");
    //             return null;
    //         }

    //         return user;
    //     }
    //     catch (Exception ex)
    //     {
    //         _logger.LogError(ex, $"Error authenticating user with email {email}");
    //         return null; // Or throw the exception if you want the controller to handle it
    //     }
    // }

    public async Task<User?> CreateUserAsync(User user)
    {
        try
        {
            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation($"User created with id {user.Id}");
            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error creating user");
            return null; // Or throw the exception if you want the controller to handle it
        }
    }

    public async Task<User?> RegisterUserAsync(RegisterRequest request)
    {
        try
        {
            if (await _dbContext.Users.AnyAsync(u => u.Email == request.Email))
            {
                _logger.LogWarning($"Registration failed: Email {request.Email} is already registered.");
                return null;
            }

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = request.Username,
                FullName = request.FullName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender,
                Address = request.Address,
                AvatarUrl = request.AvatarUrl,
                Bio = request.Bio,
                Role = request.Role,
                CreatedAt = DateTime.UtcNow,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };

            _dbContext.Users.Add(user);

            // Nếu là Owner thì tạo OwnerProfile
            if (request.Role == Role.Owner)
            {
                var ownerProfile = new OwnerProfile
                {
                    UserId = user.Id,
                    // CompanyName = request.CompanyName ?? string.Empty,
                    // ContactInfo = request.ContactInfo,
                    // AdditionalInfo = request.AdditionalInfo,
                    CreatedAt = DateTime.UtcNow
                };

                _dbContext.OwnerProfiles.Add(ownerProfile);
            }

            await _dbContext.SaveChangesAsync();
            _logger.LogInformation($"User registered: {user.Email}, Role: {user.Role}");

            return user;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user");
            return null;
        }
    }

    public async Task<bool> LogoutAsync(Guid userId)
    {
        // TODO: Implement a secure logout mechanism (e.g., token invalidation)
        // In many cases, a simple logout involves clearing the token on the client side.
        // For more advanced scenarios, you might consider using refresh token revocation or blacklisting tokens.
        // This implementation is a placeholder.
        _logger.LogInformation($"User with id {userId} logged out.");
        return true; // Placeholder
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        try
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting user with email {email}");
            return null; // Or throw the exception if you want the controller to handle it
        }
    }

    public async Task<bool> HasAnySysAdminAsync()
    {
        return await _dbContext.Users.AnyAsync(u => u.Role == Role.SysAdmin);
    }
    public async Task<OwnerProfile?> GetOwnerProfileByUserIdAsync(Guid userId)
    {
        return await _dbContext.OwnerProfiles
            .FirstOrDefaultAsync(op => op.UserId == userId);
    }

    public async Task<OwnerProfile?> CreateOwnerProfileAsync(OwnerProfile ownerProfile)
    {
        try
        {
            _dbContext.OwnerProfiles.Add(ownerProfile);
            await _dbContext.SaveChangesAsync();
            _logger.LogInformation($"OwnerProfile created for user {ownerProfile.UserId}");
            return ownerProfile;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error creating OwnerProfile for user {ownerProfile.UserId}");
            return null;
        }
    }
    // Implement other user-related operations
}