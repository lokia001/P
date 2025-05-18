// Backend.Api/Modules/UserService/Dtos/OwnerProfileDto.cs
using System;

namespace Backend.Api.Modules.UserService.Models
{
    public class OwnerProfileDto
    {
        public Guid UserId { get; set; } // Giữ lại UserId để biết nó thuộc User nào
        public string CompanyName { get; set; } = string.Empty;
        public string? ContactInfo { get; set; }
        public string? AdditionalInfo { get; set; }
        public string? BusinessLicenseNumber { get; set; }
        public string? TaxCode { get; set; }
        public string? Website { get; set; }
        public string? LogoUrl { get; set; }
        public bool IsVerified { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Các collection như OwnedSpaces thường không đưa vào DTO chính của OwnerProfile
        // trừ khi có yêu cầu cụ thể, để tránh DTO quá lớn.
        // public ICollection<SpaceSummaryDto>? OwnedSpaces { get; set; } // Ví dụ nếu cần
    }
}