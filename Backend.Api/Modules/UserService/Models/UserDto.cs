// Backend.Api/Modules/UserService/Dtos/UserDto.cs
using System;
using System.Collections.Generic;
// Không cần using các entity service khác trừ khi bạn quyết định nhúng DTO của chúng vào đây.
// Ví dụ, nếu bạn muốn UserDto có một List<BookingSummaryDto>, thì mới cần using BookingService.Dtos.

namespace Backend.Api.Modules.UserService.Models
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        // PasswordHash KHÔNG BAO GIỜ được trả về trong DTO
        public string? Bio { get; set; }
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = string.Empty; // Chuyển Enum Role thành string
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public DateTime? DateOfBirth { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty; // Chuyển Enum Gender thành string
        public string? Address { get; set; }
        public string? AvatarUrl { get; set; }

        // Thông tin OwnerProfile (nếu có)
        public OwnerProfileDto? OwnerProfile { get; set; }

        // Các collection lớn như Bookings, CreatedSpaces, Reviews, etc.
        // thường không được bao gồm trực tiếp trong UserDto chính để giữ cho nó gọn nhẹ.
        // Nếu cần, bạn có thể tạo các DTOs chuyên biệt hơn (ví dụ: UserWithDetailsDto)
        // hoặc client sẽ gọi các endpoint riêng để lấy thông tin này.

        // Ví dụ, nếu bạn muốn trả về số lượng space đã tạo:
        // public int CreatedSpacesCount { get; set; }

        // Hoặc danh sách ID của các space (ít phổ biến hơn cho DTO chính):
        // public List<Guid>? CreatedSpaceIds { get; set; }
    }
}


