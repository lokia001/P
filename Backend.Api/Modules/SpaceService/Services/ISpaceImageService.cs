using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Api.Modules.SpaceService.Dtos.Space; // Đảm bảo using đúng namespace DTOs

namespace Backend.Api.Modules.SpaceService.Services
{
    public interface ISpaceImageService
    {

        Task<SpaceImageResponseDto?> AddImageToSpaceAsync(Guid spaceId, CreateSpaceImageRequestDto request);
        Task<SpaceImageResponseDto?> GetSpaceImageByIdAsync(Guid imageId);
        Task<List<SpaceImageResponseDto>> GetImagesForSpaceAsync(Guid spaceId);
        Task<SpaceImageResponseDto?> UpdateSpaceImageAsync(Guid imageId, UpdateSpaceImageRequestDto request);
        Task<bool> RemoveImageFromSpaceAsync(Guid imageId);
    }
}