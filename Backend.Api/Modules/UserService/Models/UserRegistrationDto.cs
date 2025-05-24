// Backend.Api/Modules/AuthService/Dtos/UserRegistrationDto.cs
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.UserService.Models // Hoặc namespace phù hợp với cấu trúc dự án của bạn
{
    public class UserRegistrationDto
    {
        [Required(ErrorMessage = "Username is required.")]
        // [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters.")]
        // [RegularExpression(@"^[a-zA-Z0-9_.-]*$", ErrorMessage = "Username can only contain letters, numbers, underscore, dot, or hyphen.")] // Tùy chọn: Giới hạn ký tự cho username
        public string Username { get; set; } = string.Empty;

        // [Required(ErrorMessage = "Password is required.")]
        // [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
        // Ví dụ về regex yêu cầu mật khẩu phức tạp (ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt)
        // Bạn có thể điều chỉnh hoặc bỏ qua nếu không cần thiết
        // [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#-])[A-Za-z\d@$!%*?&_#-]{8,}$",
        //     ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Confirm Password is required.")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        [StringLength(100, ErrorMessage = "Email cannot be longer than 100 characters.")]
        public string Email { get; set; } = string.Empty;

        // [Required(ErrorMessage = "Full name is required.")]
        [StringLength(100, ErrorMessage = "Full name cannot be longer than 100 characters.")]
        public string FullName { get; set; } = string.Empty;

        // Các trường tùy chọn có thể được thêm vào khi đăng ký
        [Phone(ErrorMessage = "Invalid phone number format.")] // Sử dụng [Phone] attribute nếu bạn muốn validation cơ bản
        [StringLength(20, ErrorMessage = "Phone number cannot be longer than 20 characters.")]
        public string? PhoneNumber { get; set; }

        // public DateTime? DateOfBirth { get; set; } // Nếu bạn cho phép nhập ngày sinh khi đăng ký

        // public string? Gender { get; set; } // Nếu bạn muốn người dùng chọn giới tính khi đăng ký (dưới dạng string)
        // Sau đó bạn sẽ parse sang Gender enum trong controller/service
    }
}