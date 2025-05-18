using AutoMapper;
using Backend.Api.Data;
using Backend.Api.Modules.SpaceService.Dtos.Amenity;
using Backend.Api.Modules.SpaceService.Dtos.Space;
using Backend.Api.Modules.SpaceService.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// using Backend.Api.Data; // Namespace của DbContext

namespace Backend.Api.Modules.SpaceService.Services
{
    public class SpaceAmenityManagementService : ISpaceAmenityManagementService
    {
        private readonly AppDbContext _context; // THAY AppDbContext BẰNG TÊN DbContext CỦA BẠN
        private readonly IMapper _mapper;
        private readonly ILogger<SpaceAmenityManagementService> _logger;
        private readonly IAmenityService _amenityService; // Có thể cần để kiểm tra amenity tồn tại

        public SpaceAmenityManagementService(
            AppDbContext context,
            IMapper mapper,
            ILogger<SpaceAmenityManagementService> logger,
            IAmenityService amenityService) // Inject IAmenityService
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _amenityService = amenityService;
        }

        public async Task<AmenityDto?> AddAmenityToSpaceAsync(Guid spaceId, AddAmenityToSpaceDto request)
        {
            var space = await _context.Spaces.FindAsync(spaceId);
            if (space == null)
            {
                _logger.LogWarning("Space with ID {SpaceId} not found when trying to add amenity.", spaceId);
                return null; // Hoặc throw NotFoundException
            }

            var amenity = await _amenityService.GetAmenityByIdAsync(request.AmenityId);
            if (amenity == null)
            {
                _logger.LogWarning("Amenity with ID {AmenityId} not found when trying to add to space {SpaceId}.", request.AmenityId, spaceId);
                return null; // Hoặc throw NotFoundException
            }

            // Kiểm tra xem amenity đã được thêm vào space này chưa
            var existingLink = await _context.SpaceAmenities
                .AnyAsync(sa => sa.SpaceId == spaceId && sa.AmenityId == request.AmenityId);

            if (existingLink)
            {
                _logger.LogInformation("Amenity {AmenityId} is already linked to Space {SpaceId}.", request.AmenityId, spaceId);
                // Trả về amenity đã tồn tại hoặc null/thông báo lỗi tùy logic
                return _mapper.Map<AmenityDto>(amenity); // Trả về thông tin amenity đã được link
            }

            var spaceAmenity = new SpaceAmenity
            {
                SpaceAmenityId = Guid.NewGuid(),
                SpaceId = spaceId,
                AmenityId = request.AmenityId
            };

            try
            {
                await _context.SpaceAmenities.AddAsync(spaceAmenity);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Amenity {AmenityId} added to Space {SpaceId}.", request.AmenityId, spaceId);
                return _mapper.Map<AmenityDto>(amenity); // Trả về DTO của amenity vừa được thêm
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "DB error adding amenity {AmenityId} to space {SpaceId}.", request.AmenityId, spaceId);
                throw;
            }
        }

        public async Task<bool> RemoveAmenityFromSpaceAsync(Guid spaceId, Guid amenityId)
        {
            var spaceAmenityLink = await _context.SpaceAmenities
                .FirstOrDefaultAsync(sa => sa.SpaceId == spaceId && sa.AmenityId == amenityId);

            if (spaceAmenityLink == null)
            {
                _logger.LogWarning("Link between Space {SpaceId} and Amenity {AmenityId} not found for removal.", spaceId, amenityId);
                return false;
            }

            try
            {
                _context.SpaceAmenities.Remove(spaceAmenityLink);
                var result = await _context.SaveChangesAsync();
                if (result > 0)
                {
                    _logger.LogInformation("Amenity {AmenityId} removed from Space {SpaceId}.", amenityId, spaceId);
                    return true;
                }
                _logger.LogWarning("Link for Amenity {AmenityId} and Space {SpaceId} found but not removed.", amenityId, spaceId);
                return false;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "DB error removing amenity {AmenityId} from space {SpaceId}.", amenityId, spaceId);
                throw;
            }
        }

        public async Task<List<AmenityDto>> GetAmenitiesForSpaceAsync(Guid spaceId)
        {
            var spaceExists = await _context.Spaces.AnyAsync(s => s.Id == spaceId);
            if (!spaceExists)
            {
                _logger.LogWarning("Space with ID {SpaceId} not found when trying to get amenities.", spaceId);
                return new List<AmenityDto>(); // Hoặc throw NotFoundException
            }

            var amenities = await _context.SpaceAmenities
                .Where(sa => sa.SpaceId == spaceId)
                .Include(sa => sa.Amenity) // Quan trọng: để lấy thông tin của Amenity
                .Select(sa => sa.Amenity)
                .OrderBy(a => a.Name)
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<List<AmenityDto>>(amenities);
        }
    }
}