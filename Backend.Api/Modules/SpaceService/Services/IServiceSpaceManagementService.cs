using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Api.Modules.SpaceService.Dtos.ServiceSpace; // Cho ServiceSpace DTOs
// Giả sử bạn có ServiceDto từ module ServiceService nếu cần trả về thông tin Service
// using Backend.Api.Modules.ServiceService.Dtos.Service;

namespace Backend.Api.Modules.SpaceService.Services
{
    public interface IServiceSpaceManagementService
    {
        /// <summary>
        /// Adds a service to a specific space with additional relationship details.
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        /// <param name="request">DTO containing the Service ID and relationship details (Notes, IsIncludedInBasePrice).</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains the <see cref="ServiceSpaceDto"/> representing the newly created link.
        /// Returns null if space or service not found.
        /// </returns>
        Task<ServiceSpaceDto?> AddServiceToSpaceAsync(Guid spaceId, AddServiceToSpaceDto request);

        /// <summary>
        /// Updates the details of a service linked to a specific space.
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        /// <param name="serviceId">The ID of the service whose link details are to be updated.</param>
        /// <param name="request">DTO containing the updated relationship details (Notes, IsIncludedInBasePrice).</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains the updated <see cref="ServiceSpaceDto"/>.
        /// Returns null if the link between the space and service is not found.
        /// </returns>
        Task<ServiceSpaceDto?> UpdateServiceOnSpaceAsync(Guid spaceId, Guid serviceId, UpdateServiceOnSpaceDto request);

        /// <summary>
        /// Removes a service from a specific space.
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        /// <param name="serviceId">The ID of the service to remove.</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains true if the removal was successful; otherwise, false.
        /// </returns>
        Task<bool> RemoveServiceFromSpaceAsync(Guid spaceId, Guid serviceId);

        /// <summary>
        /// Gets all services (and their relationship details) associated with a specific space.
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        /// <returns>A list of <see cref="ServiceSpaceDto"/> for the given space.</returns>
        Task<List<ServiceSpaceDto>> GetServicesForSpaceAsync(Guid spaceId);

        /// <summary>
        /// Gets a specific service (and its relationship details) linked to a space.
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        /// <param name="serviceId">The ID of the service.</param>
        /// <returns>The <see cref="ServiceSpaceDto"/> if the link exists; otherwise, null.</returns>
        Task<ServiceSpaceDto?> GetServiceForSpaceAsync(Guid spaceId, Guid serviceId);
    }
}