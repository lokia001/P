// Backend.Api/Controllers/AdminController.cs (Hoặc Backend.Api/Modules/AdminService/Controllers/AdminController.cs)
using Microsoft.AspNetCore.Authorization; // Cho [Authorize]
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper; // Cho IMapper
using Backend.Api.Modules.UserService.Services; // Cho IUserService
using Backend.Api.Modules.UserService.Entities; // Cho User entity và Role enum
using Backend.Api.Modules.UserService.Models;   // Cho UpdateUserRoleDto
using Microsoft.Extensions.Logging; // Cho ILogger

namespace Backend.Api.Controllers // Hoặc Backend.Api.Modules.AdminService.Controllers
{
    [ApiController]
    [Route("api/admin")]
    // Yêu cầu xác thực JWT và vai trò Admin HOẶC SysAdmin cho tất cả các action trong controller này
    [Authorize(Roles = $"{nameof(Role.Admin)},{nameof(Role.SysAdmin)}")] // Sử dụng nameof để tránh lỗi chính tả
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IUserService userService, IMapper mapper, ILogger<AdminController> logger)
        {
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // 1. Lấy danh sách tất cả người dùng
        // GET /api/admin/users
        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                // Giả sử GetAllUsersAsync() trả về IEnumerable<User>
                // Nếu nó đã trả về IEnumerable<UserDto>, bạn không cần map nữa.
                var userDtos = _mapper.Map<IEnumerable<UserDto>>(users);
                return Ok(userDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching all users.");
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        // 2. Lấy thông tin chi tiết của một người dùng
        // GET /api/admin/users/{userId}
        [HttpGet("users/{userId}")]
        public async Task<ActionResult<UserDto>> GetUserById(Guid userId)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = $"User with ID {userId} not found." });
                }
                // Giả sử GetUserByIdAsync trả về User entity
                var userDto = _mapper.Map<UserDto>(user);
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching user with ID {UserId}.", userId);
                return StatusCode(500, "An internal server error occurred.");
            }
        }

        // 3. Cập nhật vai trò của người dùng
        // PUT /api/admin/users/{userId}/role
        [HttpPut("users/{userId}/role")]
        public async Task<IActionResult> UpdateUserRole(Guid userId, [FromBody] UpdateUserRoleDto updateUserRoleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Kiểm tra xem giá trị role có hợp lệ không
            if (!Enum.TryParse<Role>(updateUserRoleDto.Role, true, out Role newRoleEnum))
            {
                // Lấy danh sách các vai trò hợp lệ để hiển thị trong thông báo lỗi
                var validRoles = string.Join(", ", Enum.GetNames(typeof(Role)));
                return BadRequest(new { message = $"Invalid role value. Valid roles are: {validRoles}." });
            }

            try
            {
                var success = await _userService.UpdateUserRoleAsync(userId, newRoleEnum);
                if (!success)
                {
                    return NotFound(new { message = $"User with ID {userId} not found or role update failed." });
                }
                _logger.LogInformation("Role updated for user {UserId} to {NewRole}", userId, newRoleEnum);
                return Ok(new { message = $"User role updated successfully to {newRoleEnum}." }); // Hoặc NoContent() nếu không muốn trả về body
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating role for user {UserId}.", userId);
                return StatusCode(500, "An internal server error occurred while updating user role.");
            }
        }

        // 4. Xóa một người dùng
        // DELETE /api/admin/users/{userId}
        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(Guid userId)
        {
            try
            {
                var success = await _userService.DeleteUserAsync(userId);
                if (!success)
                {
                    return NotFound(new { message = $"User with ID {userId} not found or delete failed." });
                }
                _logger.LogInformation("User {UserId} deleted successfully.", userId);
                return NoContent(); // HTTP 204 No Content là phù hợp cho DELETE thành công
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting user {UserId}.", userId);
                return StatusCode(500, "An internal server error occurred while deleting user.");
            }
        }
    }
}