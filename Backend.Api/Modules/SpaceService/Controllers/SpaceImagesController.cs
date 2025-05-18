using Microsoft.AspNetCore.Mvc;
using Backend.Api.Modules.SpaceService.Services;
using Backend.Api.Services; // Namespace của IIBBService
using Backend.Api.Modules.SpaceService.Dtos.Space;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Linq;
using AutoMapper; // For .Any()

namespace Backend.Api.Controllers
{
    [ApiController]
    [Route("api/spaces/{spaceId:guid}/images")]
    [Authorize(Roles = "Owner")]
    public class SpaceImagesController : ControllerBase
    {
        private readonly ISpaceImageService _spaceImageService;
        private readonly ISpaceService _spaceService; // Để kiểm tra quyền sở hữu Space
        private readonly IIBBService _ibbService;
        private readonly ILogger<SpaceImagesController> _logger;
        private readonly IMapper _mapper; // Inject AutoMapper

        public SpaceImagesController(
            ISpaceImageService spaceImageService,
            ISpaceService spaceService,
            IIBBService ibbService,
            ILogger<SpaceImagesController> logger,
            IMapper mapper)
        {
            _spaceImageService = spaceImageService;
            _spaceService = spaceService;
            _ibbService = ibbService;
            _logger = logger;
            _mapper = mapper;
        }

        // Helper method to check ownership
        private async Task<bool> IsUserOwnerOfSpace(Guid spaceId, Guid userId)
        {
            // Giả định ISpaceService có phương thức GetSpaceOwnerIdAsync(Guid spaceId)
            // Hoặc GetSpaceByIdAsync trả về Space entity có OwnerProfileId
            var spaceDetails = await _spaceService.GetSpaceByIdAsync(spaceId); // Giả sử trả về DTO có OwnerProfileId hoặc entity
            if (spaceDetails == null) return false;

            // Lấy OwnerProfileId từ JWT của user hiện tại
            var ownerProfileIdString = User.FindFirstValue("OwnerProfileId"); // Thay "OwnerProfileId" bằng tên claim thực tế
            if (string.IsNullOrEmpty(ownerProfileIdString) || !Guid.TryParse(ownerProfileIdString, out Guid userOwnerProfileId))
            {
                return false; // Không có thông tin owner profile của user
            }

            // So sánh OwnerProfileId của Space với OwnerProfileId của user
            return spaceDetails.OwnerProfileId == userOwnerProfileId;
        }


        // POST: /api/spaces/{spaceId}/images
        /// <summary>
        /// Uploads one or more images for a specific space.
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        /// <param name="files">The image files to upload.</param>
        [HttpPost]
        [ProducesResponseType(typeof(List<SpaceImageResponseDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UploadSpaceImages(Guid spaceId, [FromForm] List<IFormFile> files)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out Guid userId))
                return Unauthorized("Invalid user identifier.");

            if (!await IsUserOwnerOfSpace(spaceId, userId))
                return Forbid("User is not the owner of this space.");

            if (files == null || !files.Any())
                return BadRequest("No files uploaded.");

            // Giới hạn số lượng file hoặc kích thước file nếu cần
            // if (files.Count > 5) return BadRequest("Cannot upload more than 5 files at once.");

            var uploadedImageResponses = new List<SpaceImageResponseDto>();

            foreach (var file in files)
            {
                if (file.Length == 0) continue;
                // Validate file type/size if needed

                var imgBbResult = await _ibbService.UploadImageAsync(file);
                if (imgBbResult == null || !imgBbResult.Success || imgBbResult.Data == null)
                {
                    _logger.LogWarning("Failed to upload file {FileName} to ImgBB for space {SpaceId}.", file.FileName, spaceId);
                    // Có thể chọn tiếp tục với các file khác hoặc trả về lỗi ngay
                    continue; // Bỏ qua file này và tiếp tục
                }

                // Mặc định DisplayOrder có thể dựa trên số lượng ảnh hiện tại hoặc một logic khác
                var currentImages = await _spaceImageService.GetImagesForSpaceAsync(spaceId);
                int nextDisplayOrder = currentImages.Any() ? currentImages.Max(img => img.DisplayOrder) + 1 : 0;


                var createImageDto = new CreateSpaceImageRequestDto
                {
                    ImageUrl = imgBbResult.Data.Display_url ?? imgBbResult.Data.Url ?? string.Empty,
                    DisplayOrder = nextDisplayOrder,
                    // IsMain = (nextDisplayOrder == 0) // Ví dụ logic cho IsMain
                    // DeleteUrl = imgBbResult.Data.Delete_url // Lưu nếu bạn muốn, dù có thể không dùng được
                };

                if (string.IsNullOrEmpty(createImageDto.ImageUrl))
                {
                    _logger.LogWarning("ImgBB did not return a valid image URL for file {FileName}.", file.FileName);
                    continue;
                }

                var addedImageDto = await _spaceImageService.AddImageToSpaceAsync(spaceId, createImageDto);
                if (addedImageDto != null)
                {
                    uploadedImageResponses.Add(addedImageDto);
                }
            }

            if (!uploadedImageResponses.Any())
            {
                return BadRequest("No images were successfully uploaded and saved.");
            }

            // Trả về danh sách các ảnh đã được tạo
            // Có thể trả về route của action GetImagesForSpaceAsync
            return CreatedAtAction(nameof(GetSpaceImages), new { spaceId = spaceId }, uploadedImageResponses);
        }


        // GET: /api/spaces/{spaceId}/images
        /// <summary>
        /// Gets all images for a specific space.
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        [HttpGet]
        [ProducesResponseType(typeof(List<SpaceImageResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetSpaceImages(Guid spaceId)
        {
            // Không cần kiểm tra ownership cho GET nếu ảnh là public,
            // nhưng nếu chỉ owner được xem thì cần kiểm tra. Giả sử là public.
            // var space = await _spaceService.GetSpaceByIdAsync(spaceId);
            // if (space == null) return NotFound("Space not found.");

            var images = await _spaceImageService.GetImagesForSpaceAsync(spaceId);
            return Ok(images);
        }


        // PUT: /api/spaces/{spaceId}/images/{imageId}
        /// <summary>
        /// Updates information for a specific image of a space (e.g., display order).
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        /// <param name="imageId">The ID of the image to update.</param>
        /// <param name="request">The update request data.</param>
        [HttpPut("{imageId:guid}")]
        [ProducesResponseType(typeof(SpaceImageResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateSpaceImage(Guid spaceId, Guid imageId, [FromBody] UpdateSpaceImageRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out Guid userId))
                return Unauthorized("Invalid user identifier.");

            if (!await IsUserOwnerOfSpace(spaceId, userId))
                return Forbid("User is not the owner of this space.");

            // Kiểm tra xem imageId có thuộc spaceId không
            var image = await _spaceImageService.GetSpaceImageByIdAsync(imageId);
            if (image == null || image.SpaceId != spaceId)
                return NotFound("Image not found or does not belong to the specified space.");


            var updatedImage = await _spaceImageService.UpdateSpaceImageAsync(imageId, request);
            if (updatedImage == null)
                return NotFound("Image not found or update failed.");

            return Ok(updatedImage);
        }

        // DELETE: /api/spaces/{spaceId}/images/{imageId}
        /// <summary>
        /// Deletes a specific image from a space.
        /// </summary>
        /// <param name="spaceId">The ID of the space.</param>
        /// <param name="imageId">The ID of the image to delete.</param>
        [HttpDelete("{imageId:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteSpaceImage(Guid spaceId, Guid imageId)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out Guid userId))
                return Unauthorized("Invalid user identifier.");

            if (!await IsUserOwnerOfSpace(spaceId, userId))
                return Forbid("User is not the owner of this space.");

            var imageToDelete = await _spaceImageService.GetSpaceImageByIdAsync(imageId);
            if (imageToDelete == null || imageToDelete.SpaceId != spaceId)
                return NotFound("Image not found or does not belong to the specified space.");

            // Nếu bạn đã lưu DeleteUrl và IIBBService.DeleteImageAsync hoạt động:
            // if (!string.IsNullOrEmpty(imageToDelete.DeleteUrl)) // Giả sử DTO có DeleteUrl
            // {
            //     bool ibbDeleted = await _ibbService.DeleteImageAsync(imageToDelete.DeleteUrl);
            //     if (!ibbDeleted)
            //     {
            //         _logger.LogWarning("Failed to delete image {ImageId} from ImgBB (DeleteUrl: {DeleteUrl}). Proceeding with DB deletion.", imageId, imageToDelete.DeleteUrl);
            //     }
            // }

            var dbDeleted = await _spaceImageService.RemoveImageFromSpaceAsync(imageId);
            if (!dbDeleted)
                return NotFound("Image could not be deleted from the database or was not found.");

            return NoContent();
        }
    }
}