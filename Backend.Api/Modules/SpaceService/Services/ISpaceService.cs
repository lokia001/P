// File: Backend.Api/Modules/SpaceService/Services/ISpaceService.cs
using System;
using System.Threading.Tasks;
using Backend.Api.Modules.SpaceService.Dtos.Space; // Namespace cho SpaceResponseDto
using Backend.Api.Modules.SpaceService.Entities;   // Namespace cho Space entity

namespace Backend.Api.Modules.SpaceService.Services
{
    public interface ISpaceService
    {
        Task<Space?> CreateSpaceAsync(Space spaceToCreate); // Đã có từ trước

        // THÊM HOẶC ĐẢM BẢO PHƯƠNG THỨC NÀY TỒN TẠI VỚI KIỂU TRẢ VỀ PHÙ HỢP
        /// <summary>
        /// Retrieves a space by its ID, returning detailed information.
        /// </summary>
        /// <param name="spaceId">The ID of the space to retrieve.</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains the <see cref="SpaceResponseDto"/> if found (which includes OwnerProfileId);
        /// otherwise, null.
        /// </returns>
        Task<SpaceResponseDto?> GetSpaceByIdAsync(Guid spaceId); // Phương thức này cần tồn tại và trả về DTO có OwnerProfileId

        // Các phương thức khác của ISpaceService (nếu có)
        // Task<List<SpaceResponseDto>> GetAllSpacesAsync(...);
        // Task<SpaceResponseDto?> UpdateSpaceAsync(Guid spaceId, ...);
        // Task<bool> DeleteSpaceAsync(Guid spaceId);
    }
}