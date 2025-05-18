// File: Backend.Api/Modules/SpaceService/Dtos/Space/SpaceServiceCreationDto.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.SpaceService.Dtos.Space
{
    public class SpaceServiceCreationDto
    {
        [Required(ErrorMessage = "Service ID is required.")]
        public Guid ServiceId { get; set; }

        [Required(ErrorMessage = "Price for the service is required.")]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be a non-negative value.")]
        public decimal Price { get; set; }

        // Các thuộc tính khác của ServiceSpace mà bạn muốn client cung cấp khi tạo, ví dụ:
        // public string? Notes { get; set; }
        // public bool IsIncludedInBasePrice { get; set; } = false;
        // Nếu các trường này giống với AddServiceToSpaceDto, bạn có thể cân nhắc tái sử dụng hoặc kế thừa.
        // Trong mô tả của bạn chỉ có ServiceId và Price, tôi sẽ giữ theo đó.
        // Nếu Price này là giá của chính Service đó tại Space này (không phải giá gốc của Service),
        // thì entity ServiceSpace cần có trường Price. Entity ServiceSpace bạn cung cấp chưa có trường Price.
        // Tôi sẽ giả định Price này sẽ được lưu vào ServiceSpace.Notes hoặc một trường tương tự,
        // HOẶC bạn cần thêm trường Price vào entity ServiceSpace.
        //
        // Giả định 1: Price này sẽ được lưu vào ServiceSpace.Notes dạng "Price: {value}"
        // Giả định 2 (TỐT HƠN): Thêm trường Price vào ServiceSpace entity.
        // Ví dụ: public decimal PriceOverride { get; set; } trong ServiceSpace.cs
        //
        // Cho mục đích hiện tại, tôi sẽ giả định bạn sẽ xử lý việc lưu Price này trong logic service.
        // Nếu ServiceSpace entity có trường `PriceOverride`, AutoMapper có thể map trực tiếp.
    }
}