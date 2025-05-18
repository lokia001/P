// Backend.Api/Modules/AdminService/Dtos/UpdateUserRoleDto.cs (Hoặc trong UserService/Dtos nếu thấy hợp lý hơn)
using System.ComponentModel.DataAnnotations;
using Backend.Api.Modules.UserService.Entities; // Để tham chiếu Role enum cho validation (tùy chọn)

namespace Backend.Api.Modules.UserService.Models // Hoặc namespace phù hợp
{
    public class UpdateUserRoleDto
    {
        [Required(ErrorMessage = "Role is required.")]
        // Bạn có thể thêm một custom validation attribute để kiểm tra giá trị enum hợp lệ
        // Hoặc kiểm tra trong controller.
        public string Role { get; set; } = string.Empty;
    }
}