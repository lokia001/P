// File: Backend.Api/Modules/SpaceService/Services/SpaceService.cs
using AutoMapper; // Nếu bạn cần map gì đó bên trong service này, mặc dù map chính thường ở controller hoặc mapping profile
using Backend.Api.Data;
using Backend.Api.Modules.SpaceService.Dtos.Space;
using Backend.Api.Modules.SpaceService.Entities;
using Microsoft.EntityFrameworkCore; // Cho DbContext
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

// using Backend.Api.Data; // Namespace của DbContext của bạn

namespace Backend.Api.Modules.SpaceService.Services
{
    public class SpaceService : ISpaceService
    {
        private readonly AppDbContext _context; // THAY AppDbContext BẰNG TÊN DbContext CỦA BẠN
        private readonly IMapper _mapper; // Inject nếu cần map trong service
        private readonly ILogger<SpaceService> _logger;

        public SpaceService(AppDbContext context, IMapper mapper, ILogger<SpaceService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        // TRIỂN KHAI PHƯƠNG THỨC CreateSpaceAsync
        public async Task<Space?> CreateSpaceAsync(Space spaceToCreate)
        {
            if (spaceToCreate == null)
            {
                throw new ArgumentNullException(nameof(spaceToCreate));
            }

            try
            {
                // Đảm bảo các giá trị mặc định hoặc được server gán là đúng
                // AutoMapper profile đã có thể xử lý một số việc này, nhưng service là nơi cuối cùng để đảm bảo.
                spaceToCreate.Id = Guid.NewGuid(); // Hoặc để DB tự gán nếu cấu hình
                spaceToCreate.CreatedAt = DateTime.UtcNow;
                spaceToCreate.Status = SpaceStatus.Available; // Trạng thái ban đầu
                // CreatedByUserId và OwnerProfileId đã được gán trong controller trước khi gọi service này.

                await _context.Spaces.AddAsync(spaceToCreate);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Space created successfully with ID {SpaceId}", spaceToCreate.Id);
                return spaceToCreate; // Trả về entity đã được lưu (có ID từ DB)
            }
            catch (DbUpdateException dbEx) // Lỗi cụ thể từ EF Core
            {
                _logger.LogError(dbEx, "Database error occurred while creating space: {Name}", spaceToCreate.Name);
                // Phân tích InnerException để tìm nguyên nhân gốc (ví dụ: lỗi constraint)
                // throw; // Hoặc trả về null, hoặc throw một exception tùy chỉnh
                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected error occurred while creating space: {Name}", spaceToCreate.Name);
                // throw;
                return null;
            }
        }

        // TRIỂN KHAI HOẶC ĐẢM BẢO PHƯƠNG THỨC NÀY TỒN TẠI VÀ ĐÚNG
        public async Task<SpaceResponseDto?> GetSpaceByIdAsync(Guid spaceId)
        {
            var spaceEntity = await _context.Spaces
                // Include các navigation properties cần thiết cho SpaceResponseDto
                .Include(s => s.SpaceImages)
                .Include(s => s.SpaceAmenities)
                    .ThenInclude(sa => sa.Amenity) // Để map sang List<AmenityDto>
                .Include(s => s.ServiceSpaces)
                    .ThenInclude(ss => ss.Service) // Để map sang List<ServiceSpaceDto> (nếu ServiceSpaceDto có thông tin Service)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == spaceId);

            if (spaceEntity == null)
            {
                _logger.LogInformation("Space with ID {SpaceId} not found.", spaceId);
                return null;
            }

            // AutoMapper sẽ map Space entity sang SpaceResponseDto
            // SpaceResponseDto đã có OwnerProfileId
            return _mapper.Map<SpaceResponseDto>(spaceEntity);
        }
        // Implement các phương thức khác của ISpaceService ở đây...
        // public async Task<SpaceResponseDto?> GetSpaceByIdAsync(Guid spaceId) { ... }
        // public async Task<List<SpaceResponseDto>> GetAllSpacesAsync(QueryParameters queryParams) { ... }
        // ...
    }
}