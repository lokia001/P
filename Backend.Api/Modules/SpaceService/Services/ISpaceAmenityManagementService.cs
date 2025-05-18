using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Api.Modules.SpaceService.Dtos.Amenity; // Cho AmenityDto
using Backend.Api.Modules.SpaceService.Dtos.Space;    // Cho AddAmenityToSpaceDto và SpaceAmenityDto (nếu dùng)

namespace Backend.Api.Modules.SpaceService.Services
{
    public interface ISpaceAmenityManagementService
    {
        /// <summary>
        /// Adds an amenity to a specific space.
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        /// <param name="request">DTO containing the ID of the amenity to add.</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result could be a <see cref="SpaceAmenityDto"/> representing the link,
        /// or simply a boolean indicating success. Returning AmenityDto of the added amenity is also an option.
        /// For simplicity, let's return the AmenityDto that was added.
        /// Returns null if space or amenity not found, or if already linked.
        /// </returns>
        Task<AmenityDto?> AddAmenityToSpaceAsync(Guid spaceId, AddAmenityToSpaceDto request);

        /// <summary>
        /// Removes an amenity from a specific space.
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        /// <param name="amenityId">The ID of the amenity to remove.</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains true if the removal was successful; otherwise, false.
        /// </returns>
        Task<bool> RemoveAmenityFromSpaceAsync(Guid spaceId, Guid amenityId);

        /// <summary>
        /// Gets all amenities associated with a specific space.
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        /// <returns>A list of <see cref="AmenityDto"/> for the given space.</returns>
        Task<List<AmenityDto>> GetAmenitiesForSpaceAsync(Guid spaceId);

        // Nếu bạn cần cập nhật thông tin trên chính bảng nối SpaceAmenity (nếu nó có thêm trường ngoài khóa)
        // thì có thể thêm phương thức Update. Nhưng SpaceAmenity hiện tại chỉ có khóa.
    }
}