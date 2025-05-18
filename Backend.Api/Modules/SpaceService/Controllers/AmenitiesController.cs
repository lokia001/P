using Microsoft.AspNetCore.Mvc;
using Backend.Api.Modules.SpaceService.Services; // Namespace của IAmenityService
using Backend.Api.Modules.SpaceService.Dtos.Amenity; // Namespace của Amenity DTOs
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization; // For [Authorize]
using Microsoft.Extensions.Logging; // For logging

namespace Backend.Api.Controllers // Hoặc Backend.Api.Modules.SpaceService.Controllers
{
    [ApiController]
    [Route("api/amenities")]
    [Authorize(Roles = "Owner")] // Yêu cầu xác thực JWT và vai trò "Owner" cho tất cả các action
    public class AmenitiesController : ControllerBase
    {
        private readonly IAmenityService _amenityService;
        private readonly ILogger<AmenitiesController> _logger;

        public AmenitiesController(IAmenityService amenityService, ILogger<AmenitiesController> logger)
        {
            _amenityService = amenityService;
            _logger = logger;
        }

        // POST: api/amenities
        /// <summary>
        /// Creates a new amenity.
        /// </summary>
        /// <param name="request">The amenity creation request data.</param>
        /// <returns>The created amenity.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(AmenityDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateAmenity([FromBody] CreateAmenityDto request) // Sử dụng CreateAmenityDto
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdAmenity = await _amenityService.CreateAmenityAsync(request);
                if (createdAmenity == null)
                {
                    // Service có thể trả về null nếu có lỗi logic không muốn throw exception
                    return BadRequest("Could not create the amenity. Please check the provided data.");
                }
                // Trả về 201 Created với URI đến resource mới và resource đó
                return CreatedAtAction(nameof(GetAmenityById), new { amenityId = createdAmenity.Id }, createdAmenity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating amenity with name {AmenityName}.", request.Name);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        // GET: api/amenities/{amenityId}
        /// <summary>
        /// Gets a specific amenity by its ID.
        /// </summary>
        /// <param name="amenityId">The ID of the amenity.</param>
        /// <returns>The amenity if found; otherwise, 404 Not Found.</returns>
        [HttpGet("{amenityId:guid}")]
        [ProducesResponseType(typeof(AmenityDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAmenityById(Guid amenityId)
        {
            var amenity = await _amenityService.GetAmenityByIdAsync(amenityId);
            if (amenity == null)
            {
                return NotFound($"Amenity with ID {amenityId} not found.");
            }
            return Ok(amenity);
        }

        // GET: api/amenities
        /// <summary>
        /// Gets a list of all amenities.
        /// </summary>
        /// <returns>A list of amenities.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(List<AmenityDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAllAmenities()
        {
            var amenities = await _amenityService.GetAllAmenitiesAsync();
            return Ok(amenities);
        }

        // PUT: api/amenities/{amenityId}
        /// <summary>
        /// Updates an existing amenity.
        /// </summary>
        /// <param name="amenityId">The ID of the amenity to update.</param>
        /// <param name="request">The amenity update request data.</param>
        /// <returns>The updated amenity.</returns>
        [HttpPut("{amenityId:guid}")]
        [ProducesResponseType(typeof(AmenityDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> UpdateAmenity(Guid amenityId, [FromBody] UpdateAmenityDto request) // Sử dụng UpdateAmenityDto
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedAmenity = await _amenityService.UpdateAmenityAsync(amenityId, request);
                if (updatedAmenity == null)
                {
                    return NotFound($"Amenity with ID {amenityId} not found or update failed.");
                }
                return Ok(updatedAmenity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating amenity with ID {AmenityId}.", amenityId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred.");
            }
        }

        // DELETE: api/amenities/{amenityId}
        /// <summary>
        /// Deletes an amenity by its ID.
        /// </summary>
        /// <param name="amenityId">The ID of the amenity to delete.</param>
        /// <returns>204 No Content if successful; otherwise, 404 Not Found.</returns>
        [HttpDelete("{amenityId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteAmenity(Guid amenityId)
        {
            try
            {
                var success = await _amenityService.DeleteAmenityAsync(amenityId);
                if (!success)
                {
                    return NotFound($"Amenity with ID {amenityId} not found or could not be deleted.");
                }
                return NoContent(); // 204 No Content
            }
            catch (Exception ex) // Ví dụ: DbUpdateException nếu amenity đang được sử dụng và có khóa ngoại ràng buộc
            {
                _logger.LogError(ex, "Error occurred while deleting amenity with ID {AmenityId}.", amenityId);
                // Cân nhắc trả về lỗi cụ thể hơn nếu biết nguyên nhân (ví dụ: 409 Conflict nếu đang được sử dụng)
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while deleting amenity {amenityId}. It might be in use.");
            }
        }
    }
}