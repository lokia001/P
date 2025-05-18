using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Api.Modules.SpaceService.Dtos.Amenity; // Namespace của Amenity DTOs

namespace Backend.Api.Modules.SpaceService.Services
{
    public interface IAmenityService
    {
        /// <summary>
        /// Creates a new amenity.
        /// </summary>
        /// <param name="request">DTO containing information for the new amenity.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the <see cref="AmenityDto"/> of the newly created amenity.</returns>
        Task<AmenityDto> CreateAmenityAsync(CreateAmenityDto request);

        /// <summary>
        /// Retrieves an amenity by its ID.
        /// </summary>
        /// <param name="amenityId">The ID of the amenity to retrieve.</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains the <see cref="AmenityDto"/> if found; otherwise, null.
        /// </returns>
        Task<AmenityDto?> GetAmenityByIdAsync(Guid amenityId);

        /// <summary>
        /// Retrieves a list of all amenities.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation. The task result contains a list of <see cref="AmenityDto"/>.</returns>
        Task<List<AmenityDto>> GetAllAmenitiesAsync();

        /// <summary>
        /// Updates an existing amenity.
        /// </summary>
        /// <param name="amenityId">The ID of the amenity to update.</param>
        /// <param name="request">DTO containing the information to update.</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains the updated <see cref="AmenityDto"/> if successful; otherwise, null if the amenity was not found.
        /// </returns>
        Task<AmenityDto?> UpdateAmenityAsync(Guid amenityId, UpdateAmenityDto request);

        /// <summary>
        /// Deletes an amenity by its ID.
        /// </summary>
        /// <param name="amenityId">The ID of the amenity to delete.</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains true if the deletion was successful; otherwise, false.
        /// </returns>
        Task<bool> DeleteAmenityAsync(Guid amenityId);
    }
}