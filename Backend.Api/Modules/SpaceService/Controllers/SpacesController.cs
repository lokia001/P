using Microsoft.AspNetCore.Mvc;
using Backend.Api.Modules.SpaceService.Services; // Namespace của Services
using Backend.Api.Modules.SpaceService.Dtos.Space;   // Namespace của Space DTOs
using System;
using System.Threading.Tasks;
using System.Security.Claims; // For User.FindFirst
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Backend.Api.Modules.SpaceService.Entities;
using Backend.Api.Modules.SpaceService.Dtos.ServiceSpace; // For [Authorize]
// using Backend.Api.Modules.SpaceService.Entities; // For Space entity if needed directly

namespace Backend.Api.Controllers // Hoặc Backend.Api.Modules.SpaceService.Controllers
{
    [ApiController]
    [Route("api/spaces")]
    // [Authorize] // Áp dụng authorize cho toàn bộ controller nếu cần
    public class SpaceController : ControllerBase
    {
        private readonly ISpaceService _spaceService; // Giả sử bạn có ISpaceService cho các thao tác Space cơ bản
        private readonly ISpaceAmenityManagementService _spaceAmenityService;
        private readonly IServiceSpaceManagementService _serviceSpaceService;
        private readonly IMapper _mapper; // Inject AutoMapper

        public SpaceController(
            ISpaceService spaceService,
            ISpaceAmenityManagementService spaceAmenityService,
            IServiceSpaceManagementService serviceSpaceService,
            IMapper mapper)
        {
            _spaceService = spaceService;
            _spaceAmenityService = spaceAmenityService;
            _serviceSpaceService = serviceSpaceService;
            _mapper = mapper;
        }

        // POST: api/spaces/with-details
        [HttpPost("with-details")]
        [Authorize(Roles = "Owner")] // Chỉ Owner mới được tạo
        [ProducesResponseType(typeof(SpaceResponseDto), StatusCodes.Status201Created)] // Giả sử bạn có SpaceResponseDto
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateSpaceWithDetails([FromBody] CreateSpaceWithDetailsRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // 2. Lấy UserId và OwnerProfileId từ JWT
            // UserId để gán cho CreatedByUserId
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized("User ID not found in token or invalid.");
            }

            // OwnerProfileId (giả sử bạn lưu OwnerProfileId trong claims, hoặc bạn cần query từ UserId)
            // Cách 1: Nếu OwnerProfileId có trong claims (ví dụ claim tên "OwnerProfileId")
            var ownerProfileIdString = User.FindFirstValue("OwnerProfileId"); // Thay "OwnerProfileId" bằng tên claim thực tế
            if (string.IsNullOrEmpty(ownerProfileIdString) || !Guid.TryParse(ownerProfileIdString, out Guid ownerProfileId))
            {
                // Cách 2: Nếu không có trong claim, bạn cần một service để lấy OwnerProfileId từ UserId
                // var ownerProfile = await _userProfileService.GetOwnerProfileByUserIdAsync(userId);
                // if (ownerProfile == null) return BadRequest("Owner profile not found for the user.");
                // ownerProfileId = ownerProfile.Id;
                // Dưới đây là ví dụ đơn giản, bạn cần triển khai logic này cho phù hợp
                return BadRequest("Owner Profile ID not found in token or mechanism to retrieve it is missing.");
            }

            try
            {
                // 3. Tạo Space
                // Giả sử ISpaceService có phương thức CreateSpaceAsync nhận một DTO tương tự các trường cơ bản
                // Hoặc bạn map CreateSpaceWithDetailsRequestDto sang Space entity rồi truyền vào
                var spaceEntityToCreate = _mapper.Map<Space>(request); // AutoMapper đã được cấu hình để bỏ qua collections
                spaceEntityToCreate.CreatedByUserId = userId;
                spaceEntityToCreate.OwnerProfileId = ownerProfileId;
                spaceEntityToCreate.Status = SpaceStatus.Available; // Trạng thái ban đầu
                spaceEntityToCreate.CreatedAt = DateTime.UtcNow;
                // spaceEntityToCreate.Id = Guid.NewGuid(); // EF Core sẽ tự tạo

                // Giả sử _spaceService.CreateSpaceAsync(Space entity) trả về Space entity đã được tạo
                var createdSpaceEntity = await _spaceService.CreateSpaceAsync(spaceEntityToCreate);
                if (createdSpaceEntity == null)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Failed to create space.");
                }

                // 4. Thêm Amenities (nếu có)
                if (request.AmenityIds != null && request.AmenityIds.Any())
                {
                    foreach (var amenityId in request.AmenityIds)
                    {
                        // ISpaceAmenityManagementService.AddAmenityToSpaceAsync nhận SpaceId và AddAmenityToSpaceDto
                        // AddAmenityToSpaceDto chỉ cần AmenityId
                        await _spaceAmenityService.AddAmenityToSpaceAsync(createdSpaceEntity.Id, new AddAmenityToSpaceDto { AmenityId = amenityId });
                        // Cần xử lý lỗi nếu amenityId không tồn tại hoặc không thêm được
                    }
                }

                // 5. Thêm Services (nếu có)
                if (request.Services != null && request.Services.Any())
                {
                    foreach (var serviceDto in request.Services)
                    {
                        // Giả sử AddServiceToSpaceDto đã được cập nhật để nhận PriceOverride
                        var addServiceDto = _mapper.Map<AddServiceToSpaceDto>(serviceDto);
                        // Nếu SpaceServiceCreationDto không có Notes, IsIncludedInBasePrice thì AddServiceToSpaceDto sẽ nhận giá trị mặc định
                        // addServiceDto.Notes = serviceDto.Notes; // Nếu có
                        // addServiceDto.IsIncludedInBasePrice = serviceDto.IsIncludedInBasePrice; // Nếu có

                        await _serviceSpaceService.AddServiceToSpaceAsync(createdSpaceEntity.Id, addServiceDto);
                        // Cần xử lý lỗi nếu serviceId không tồn tại hoặc không thêm được
                    }
                }

                // 6. Trả về response thành công
                // Map createdSpaceEntity sang một SpaceResponseDto (ví dụ SpaceDetailResponseDto)
                var spaceResponse = _mapper.Map<SpaceResponseDto>(createdSpaceEntity); // Thay SpaceResponseDto bằng DTO bạn muốn trả về

                // Để response có link đến resource vừa tạo:
                // return CreatedAtAction(nameof(GetSpaceById), new { id = spaceResponse.Id }, spaceResponse);
                // Giả sử bạn có action GetSpaceById
                return Created($"/api/spaces/{spaceResponse.Id}", spaceResponse); // Trả về 201 Created với object
            }
            catch (Exception ex)
            {
                // Log lỗi (ex)
                return StatusCode(StatusCodes.Status500InternalServerError, "An unexpected error occurred while creating the space with details.");
            }
        }

        // ... các action methods khác của SpaceController ...
        // Ví dụ:
        // [HttpGet("{id}")]
        // public async Task<IActionResult> GetSpaceById(Guid id)
        // {
        //     var space = await _spaceService.GetSpaceDetailsByIdAsync(id); // Giả sử
        //     if (space == null) return NotFound();
        //     return Ok(space);
        // }
    }
}