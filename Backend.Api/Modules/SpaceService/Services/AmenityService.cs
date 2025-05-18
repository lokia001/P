using AutoMapper;
using Backend.Api.Data;
using Backend.Api.Modules.SpaceService.Dtos.Amenity;
using Backend.Api.Modules.SpaceService.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Giả sử DbContext của bạn nằm trong namespace này hoặc bạn cần using đúng
// using Backend.Api.Data;

namespace Backend.Api.Modules.SpaceService.Services
{
    public class AmenityService : IAmenityService
    {
        private readonly AppDbContext _context; // THAY AppDbContext BẰNG TÊN DbContext CỦA BẠN
        private readonly IMapper _mapper;
        private readonly ILogger<AmenityService> _logger;

        public AmenityService(AppDbContext context, IMapper mapper, ILogger<AmenityService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<AmenityDto> CreateAmenityAsync(CreateAmenityDto request)
        {
            // Kiểm tra xem amenity với tên tương tự đã tồn tại chưa (tùy chọn, dựa trên yêu cầu nghiệp vụ)
            // var existingAmenity = await _context.Amenities
            //    .FirstOrDefaultAsync(a => a.Name.ToLower() == request.Name.ToLower());
            // if (existingAmenity != null)
            // {
            //    // Xử lý trường hợp tên amenity bị trùng, ví dụ throw exception hoặc trả về lỗi
            //    _logger.LogWarning("Attempted to create an amenity with a duplicate name: {AmenityName}", request.Name);
            //    throw new InvalidOperationException($"An amenity with the name '{request.Name}' already exists.");
            // }

            var amenityEntity = _mapper.Map<Amenity>(request);
            amenityEntity.Id = Guid.NewGuid(); // Đảm bảo ID mới được tạo

            try
            {
                await _context.Amenities.AddAsync(amenityEntity);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Amenity '{AmenityName}' created successfully with ID {AmenityId}.", amenityEntity.Name, amenityEntity.Id);
                return _mapper.Map<AmenityDto>(amenityEntity);
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error occurred while creating amenity '{AmenityName}'.", request.Name);
                // Phân tích InnerException để tìm nguyên nhân gốc (ví dụ: lỗi constraint)
                // Có thể throw một exception tùy chỉnh hoặc trả về null/thông báo lỗi phù hợp
                throw; // Rethrow để controller có thể bắt và xử lý
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while creating amenity '{AmenityName}'.", request.Name);
                throw;
            }
        }

        public async Task<AmenityDto?> GetAmenityByIdAsync(Guid amenityId)
        {
            var amenityEntity = await _context.Amenities
                                              .AsNoTracking()
                                              .FirstOrDefaultAsync(a => a.Id == amenityId);

            if (amenityEntity == null)
            {
                _logger.LogInformation("Amenity with ID {AmenityId} not found.", amenityId);
                return null;
            }

            return _mapper.Map<AmenityDto>(amenityEntity);
        }

        public async Task<List<AmenityDto>> GetAllAmenitiesAsync()
        {
            var amenityEntities = await _context.Amenities
                                                .AsNoTracking()
                                                .OrderBy(a => a.Name) // Sắp xếp theo tên cho nhất quán
                                                .ToListAsync();

            return _mapper.Map<List<AmenityDto>>(amenityEntities);
        }

        public async Task<AmenityDto?> UpdateAmenityAsync(Guid amenityId, UpdateAmenityDto request)
        {
            var amenityEntity = await _context.Amenities.FindAsync(amenityId);

            if (amenityEntity == null)
            {
                _logger.LogWarning("Amenity with ID {AmenityId} not found for update.", amenityId);
                return null;
            }

            // Kiểm tra trùng tên nếu tên được cập nhật (tùy chọn)
            // if (!string.IsNullOrEmpty(request.Name) && request.Name.ToLower() != amenityEntity.Name.ToLower())
            // {
            //     var existingAmenityWithNewName = await _context.Amenities
            //         .FirstOrDefaultAsync(a => a.Name.ToLower() == request.Name.ToLower() && a.Id != amenityId);
            //     if (existingAmenityWithNewName != null)
            //     {
            //         _logger.LogWarning("Attempted to update amenity {AmenityId} to a duplicate name: {NewAmenityName}", amenityId, request.Name);
            //         throw new InvalidOperationException($"An amenity with the name '{request.Name}' already exists.");
            //     }
            // }

            _mapper.Map(request, amenityEntity); // AutoMapper sẽ chỉ cập nhật các trường non-null từ DTO
                                                 // nếu profile được cấu hình với .ForAllMembers(opts => opts.Condition(...))

            try
            {
                _context.Amenities.Update(amenityEntity);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Amenity {AmenityId} - '{AmenityName}' updated.", amenityEntity.Id, amenityEntity.Name);
                return _mapper.Map<AmenityDto>(amenityEntity);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency error while updating Amenity {AmenityId}.", amenityId);
                throw; // Hoặc xử lý cụ thể
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "Database error occurred while updating amenity {AmenityId}.", amenityId);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while updating amenity {AmenityId}.", amenityId);
                throw;
            }
        }

        public async Task<bool> DeleteAmenityAsync(Guid amenityId)
        {
            var amenityEntity = await _context.Amenities
                                              .Include(a => a.SpaceAmenities) // Quan trọng: kiểm tra xem có đang được sử dụng không
                                              .FirstOrDefaultAsync(a => a.Id == amenityId);

            if (amenityEntity == null)
            {
                _logger.LogWarning("Amenity with ID {AmenityId} not found for deletion.", amenityId);
                return false;
            }

            // Kiểm tra xem Amenity có đang được sử dụng bởi bất kỳ Space nào không
            if (amenityEntity.SpaceAmenities != null && amenityEntity.SpaceAmenities.Any())
            {
                _logger.LogWarning("Attempted to delete amenity {AmenityId} - '{AmenityName}' which is currently in use by one or more spaces.", amenityId, amenityEntity.Name);
                // Bạn có thể throw một exception cụ thể ở đây để controller bắt và trả về 409 Conflict
                // throw new InvalidOperationException($"Amenity '{amenityEntity.Name}' cannot be deleted because it is currently in use.");
                return false; // Hoặc trả về false và controller sẽ xử lý như 404 hoặc lỗi khác
            }

            try
            {
                _context.Amenities.Remove(amenityEntity);
                var result = await _context.SaveChangesAsync();

                if (result > 0)
                {
                    _logger.LogInformation("Amenity {AmenityId} - '{AmenityName}' deleted successfully.", amenityId, amenityEntity.Name);
                    return true;
                }
                _logger.LogWarning("Amenity {AmenityId} was found but not removed (SaveChangesAsync returned 0).", amenityId);
                return false;
            }
            catch (DbUpdateException dbEx) // Có thể xảy ra nếu có ràng buộc khóa ngoại khác mà bạn chưa kiểm tra
            {
                _logger.LogError(dbEx, "Database error occurred while deleting amenity {AmenityId}.", amenityId);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while deleting amenity {AmenityId}.", amenityId);
                throw;
            }
        }
    }
}