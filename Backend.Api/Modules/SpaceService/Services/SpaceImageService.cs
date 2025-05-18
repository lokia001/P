using AutoMapper;
using Backend.Api.Data;
using Backend.Api.Modules.SpaceService.Dtos.Space;
using Backend.Api.Modules.SpaceService.Entities;
using Microsoft.EntityFrameworkCore; // Cho DbContext và các phương thức EF Core
using Microsoft.Extensions.Logging; // Cho logging (tùy chọn nhưng nên có)
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Giả sử DbContext của bạn nằm trong namespace này hoặc bạn cần using đúng
// using Backend.Api.Data;
using Backend.Api.Modules.SpaceService.Models;
using Backend.Api.Modules.SpaceService.Dtos.Space;



namespace Backend.Api.Modules.SpaceService.Services
{
    public class SpaceImageService : ISpaceImageService
    {
        private readonly AppDbContext _context; // THAY AppDbContext BẰNG TÊN DbContext CỦA BẠN
        private readonly IMapper _mapper;
        private readonly ILogger<SpaceImageService> _logger;

        public SpaceImageService(AppDbContext context, IMapper mapper, ILogger<SpaceImageService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<SpaceImageResponseDto?> AddImageToSpaceAsync(Guid spaceId, CreateSpaceImageRequestDto request)
        {
            try
            {
                var spaceExists = await _context.Spaces.AnyAsync(s => s.Id == spaceId);
                if (!spaceExists)
                {
                    _logger.LogWarning("Space with ID {SpaceId} not found when trying to add image.", spaceId);
                    return null; // Hoặc throw một custom exception như NotFoundException
                }

                var spaceImageEntity = _mapper.Map<SpaceImage>(request);
                spaceImageEntity.Id = Guid.NewGuid(); // Đảm bảo ID mới được tạo
                spaceImageEntity.SpaceId = spaceId;

                // Xử lý logic cho DisplayOrder hoặc IsMain nếu cần
                // Ví dụ: Nếu request.IsMain là true, đặt DisplayOrder = 0 và cập nhật các ảnh khác
                // Hoặc nếu chỉ có DisplayOrder, đảm bảo tính duy nhất hoặc sắp xếp lại.
                // Logic này có thể phức tạp tùy yêu cầu.
                // Ví dụ đơn giản: Nếu chưa có ảnh nào, đặt DisplayOrder = 0
                var existingImagesCount = await _context.SpaceImages.CountAsync(si => si.SpaceId == spaceId);
                if (existingImagesCount == 0 && request.DisplayOrder == 0) // Hoặc nếu DTO có IsMain và request.IsMain == true
                {
                    spaceImageEntity.DisplayOrder = 0;
                }
                else if (request.DisplayOrder == 0) // Nếu muốn đặt làm ảnh chính và đã có ảnh khác
                {
                    // Cần logic để cập nhật DisplayOrder của ảnh chính cũ (nếu có)
                    // Ví dụ: Tăng DisplayOrder của tất cả các ảnh hiện tại lên 1
                    // await _context.SpaceImages
                    //    .Where(si => si.SpaceId == spaceId)
                    //    .ExecuteUpdateAsync(s => s.SetProperty(b => b.DisplayOrder, b => b.DisplayOrder + 1));
                    // Đây là ví dụ, cần cẩn thận với logic này
                }


                await _context.SpaceImages.AddAsync(spaceImageEntity);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Image {ImageId} added to Space {SpaceId}.", spaceImageEntity.Id, spaceId);
                return _mapper.Map<SpaceImageResponseDto>(spaceImageEntity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding image to space {SpaceId}.", spaceId);
                // throw; // Hoặc trả về null/thông báo lỗi tùy theo chính sách xử lý lỗi
                return null;
            }
        }

        public async Task<SpaceImageResponseDto?> GetSpaceImageByIdAsync(Guid imageId)
        {
            var spaceImageEntity = await _context.SpaceImages
                                                 .AsNoTracking()
                                                 .FirstOrDefaultAsync(img => img.Id == imageId);

            if (spaceImageEntity == null)
            {
                _logger.LogWarning("SpaceImage with ID {ImageId} not found.", imageId);
                return null;
            }

            return _mapper.Map<SpaceImageResponseDto>(spaceImageEntity);
        }

        public async Task<List<SpaceImageResponseDto>> GetImagesForSpaceAsync(Guid spaceId)
        {
            var imageEntities = await _context.SpaceImages
                                              .Where(img => img.SpaceId == spaceId)
                                              .OrderBy(img => img.DisplayOrder) // Quan trọng: Sắp xếp theo thứ tự hiển thị
                                              .AsNoTracking()
                                              .ToListAsync();

            return _mapper.Map<List<SpaceImageResponseDto>>(imageEntities);
        }

        public async Task<SpaceImageResponseDto?> UpdateSpaceImageAsync(Guid imageId, UpdateSpaceImageRequestDto request)
        {
            try
            {
                var spaceImageEntity = await _context.SpaceImages.FindAsync(imageId);
                if (spaceImageEntity == null)
                {
                    _logger.LogWarning("SpaceImage with ID {ImageId} not found for update.", imageId);
                    return null;
                }

                // Logic xử lý DisplayOrder/IsMain khi cập nhật (nếu có)
                // Ví dụ: nếu DisplayOrder thay đổi thành 0 (ảnh chính mới)
                if (request.DisplayOrder.HasValue && request.DisplayOrder.Value == 0 && spaceImageEntity.DisplayOrder != 0)
                {
                    // Tìm ảnh chính cũ và thay đổi DisplayOrder của nó
                    var oldMainImage = await _context.SpaceImages
                        .FirstOrDefaultAsync(si => si.SpaceId == spaceImageEntity.SpaceId && si.DisplayOrder == 0 && si.Id != imageId);
                    if (oldMainImage != null)
                    {
                        // Gán một DisplayOrder khác cho ảnh chính cũ, ví dụ: số lượng ảnh hiện tại + 1
                        oldMainImage.DisplayOrder = await _context.SpaceImages.CountAsync(si => si.SpaceId == spaceImageEntity.SpaceId) + 1;
                    }
                }


                _mapper.Map(request, spaceImageEntity); // AutoMapper sẽ chỉ cập nhật các trường non-null từ DTO
                                                        // nếu profile được cấu hình với .ForAllMembers(opts => opts.Condition(...))

                _context.SpaceImages.Update(spaceImageEntity);
                await _context.SaveChangesAsync();

                _logger.LogInformation("SpaceImage {ImageId} updated.", imageId);
                return _mapper.Map<SpaceImageResponseDto>(spaceImageEntity);
            }
            catch (DbUpdateConcurrencyException ex) // Xử lý lỗi tương tranh nếu có
            {
                _logger.LogError(ex, "Concurrency error while updating SpaceImage {ImageId}.", imageId);
                return null; // Hoặc throw
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating SpaceImage {ImageId}.", imageId);
                return null; // Hoặc throw
            }
        }

        public async Task<bool> RemoveImageFromSpaceAsync(Guid imageId)
        {
            try
            {
                var spaceImageEntity = await _context.SpaceImages.FindAsync(imageId);
                if (spaceImageEntity == null)
                {
                    _logger.LogWarning("SpaceImage with ID {ImageId} not found for removal.", imageId);
                    return false;
                }

                // Nếu xóa ảnh chính, có thể cần logic để chọn ảnh chính mới
                if (spaceImageEntity.DisplayOrder == 0)
                {
                    var nextImage = await _context.SpaceImages
                        .Where(si => si.SpaceId == spaceImageEntity.SpaceId && si.Id != imageId)
                        .OrderBy(si => si.DisplayOrder)
                        .FirstOrDefaultAsync();
                    if (nextImage != null)
                    {
                        nextImage.DisplayOrder = 0;
                    }
                }

                _context.SpaceImages.Remove(spaceImageEntity);
                var result = await _context.SaveChangesAsync();

                if (result > 0)
                {
                    _logger.LogInformation("SpaceImage {ImageId} removed successfully.", imageId);
                    return true;
                }
                else
                {
                    _logger.LogWarning("SpaceImage {ImageId} was found but not removed (SaveChangesAsync returned 0).", imageId);
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while removing SpaceImage {ImageId}.", imageId);
                return false; // Hoặc throw
            }
        }
    }
}