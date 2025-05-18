using Microsoft.AspNetCore.Mvc;
using Backend.Api.Modules.ServiceService.Services; // Namespace của IServiceEntityService
using Backend.Api.Modules.ServiceService.Dtos.Service;   // Namespace của Service DTOs
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization; // For [Authorize]
using Microsoft.Extensions.Logging; // For logging

namespace Backend.Api.Controllers // Hoặc Backend.Api.Modules.ServiceService.Controllers
{
    [ApiController]
    [Route("api/services")]
    [Authorize(Roles = "Owner")] // Yêu cầu xác thực JWT và vai trò "Owner"
    public class ServicesController : ControllerBase
    {
        private readonly IServiceEntityService _serviceEntityService;
        private readonly ILogger<ServicesController> _logger;

        public ServicesController(IServiceEntityService serviceEntityService, ILogger<ServicesController> logger)
        {
            _serviceEntityService = serviceEntityService;
            _logger = logger;
        }

        // POST: api/services
        /// <summary>
        /// Creates a new service.
        /// </summary>
        /// <param name="request">The service creation request data.</param>
        /// <returns>The created service.</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ServiceResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> CreateService([FromBody] CreateServiceRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdService = await _serviceEntityService.CreateServiceAsync(request);
                if (createdService == null) // Service có thể trả về null nếu có lỗi logic không throw exception
                {
                    return BadRequest("Could not create the service. Please check the provided data or try again later.");
                }
                return CreatedAtAction(nameof(GetServiceById), new { serviceId = createdService.Id }, createdService);
            }
            catch (Exception ex) // Bắt các exception cụ thể hơn nếu cần (ví dụ: DbUpdateException, InvalidOperationException cho tên trùng)
            {
                _logger.LogError(ex, "Error occurred while creating service with name {ServiceName}.", request.Name);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while creating the service.");
            }
        }

        // GET: api/services/{serviceId}
        /// <summary>
        /// Gets a specific service by its ID.
        /// </summary>
        /// <param name="serviceId">The ID of the service.</param>
        /// <returns>The service if found; otherwise, 404 Not Found.</returns>
        [HttpGet("{serviceId:guid}")]
        [ProducesResponseType(typeof(ServiceResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetServiceById(Guid serviceId)
        {
            var service = await _serviceEntityService.GetServiceByIdAsync(serviceId);
            if (service == null)
            {
                return NotFound($"Service with ID {serviceId} not found.");
            }
            return Ok(service);
        }

        // GET: api/services
        /// <summary>
        /// Gets a list of all services.
        /// </summary>
        /// <returns>A list of services.</returns>
        [HttpGet]
        [ProducesResponseType(typeof(List<ServiceResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _serviceEntityService.GetAllServicesAsync();
            return Ok(services);
        }

        // PUT: api/services/{serviceId}
        /// <summary>
        /// Updates an existing service.
        /// </summary>
        /// <param name="serviceId">The ID of the service to update.</param>
        /// <param name="request">The service update request data.</param>
        /// <returns>The updated service.</returns>
        [HttpPut("{serviceId:guid}")]
        [ProducesResponseType(typeof(ServiceResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> UpdateService(Guid serviceId, [FromBody] UpdateServiceRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedService = await _serviceEntityService.UpdateServiceAsync(serviceId, request);
                if (updatedService == null)
                {
                    return NotFound($"Service with ID {serviceId} not found or update failed.");
                }
                return Ok(updatedService);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating service with ID {ServiceId}.", serviceId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while updating the service.");
            }
        }

        // DELETE: api/services/{serviceId}
        /// <summary>
        /// Deletes a service by its ID.
        /// </summary>
        /// <param name="serviceId">The ID of the service to delete.</param>
        /// <returns>204 No Content if successful; otherwise, 404 Not Found.</returns>
        [HttpDelete("{serviceId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)] // Nếu service đang được sử dụng
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteService(Guid serviceId)
        {
            try
            {
                var success = await _serviceEntityService.DeleteServiceAsync(serviceId);
                if (!success)
                {
                    // Service có thể trả về false nếu không tìm thấy hoặc không thể xóa (ví dụ đang được dùng)
                    // Cần kiểm tra logic trong service để biết lý do chính xác
                    // Nếu service throw exception khi không thể xóa do đang được dùng, thì catch block sẽ xử lý
                    return NotFound($"Service with ID {serviceId} not found or could not be deleted.");
                }
                return NoContent(); // 204 No Content
            }
            catch (InvalidOperationException ex) // Ví dụ: Bắt lỗi nếu service đang được dùng
            {
                _logger.LogWarning(ex, "Attempted to delete service {ServiceId} which is in use or other business rule violation.", serviceId);
                return Conflict(new { message = ex.Message }); // 409 Conflict
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting service with ID {ServiceId}.", serviceId);
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while deleting service {serviceId}.");
            }
        }
    }
}