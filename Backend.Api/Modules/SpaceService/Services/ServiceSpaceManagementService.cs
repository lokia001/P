using AutoMapper;
using Backend.Api.Modules.SpaceService.Dtos.ServiceSpace; // DTOs cho ServiceSpace
using Backend.Api.Modules.SpaceService.Entities;         // Entity ServiceSpace, Space
using Backend.Api.Modules.ServiceService.Entities;       // Entity ServiceEntity
using Backend.Api.Modules.ServiceService.Services;       // IServiceEntityService (để kiểm tra Service tồn tại)
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Api.Data;

// using Backend.Api.Data; // Namespace của DbContext

namespace Backend.Api.Modules.SpaceService.Services
{
    public class ServiceSpaceManagementService : IServiceSpaceManagementService
    {
        private readonly AppDbContext _context; // THAY AppDbContext BẰNG TÊN DbContext CỦA BẠN
        private readonly IMapper _mapper;
        private readonly ILogger<ServiceSpaceManagementService> _logger;
        private readonly IServiceEntityService _serviceEntityService; // Để kiểm tra Service tồn tại

        public ServiceSpaceManagementService(
            AppDbContext context,
            IMapper mapper,
            ILogger<ServiceSpaceManagementService> logger,
            IServiceEntityService serviceEntityService) // Inject IServiceEntityService
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
            _serviceEntityService = serviceEntityService;
        }

        public async Task<ServiceSpaceDto?> AddServiceToSpaceAsync(Guid spaceId, AddServiceToSpaceDto request)
        {
            var space = await _context.Spaces.FindAsync(spaceId);
            if (space == null)
            {
                _logger.LogWarning("Space with ID {SpaceId} not found when trying to add service.", spaceId);
                return null;
            }

            var service = await _serviceEntityService.GetServiceByIdAsync(request.ServiceId);
            if (service == null)
            {
                _logger.LogWarning("Service with ID {ServiceId} not found when trying to add to space {SpaceId}.", request.ServiceId, spaceId);
                return null;
            }

            var existingLink = await _context.ServiceSpaces
                .AnyAsync(ss => ss.SpaceId == spaceId && ss.ServiceId == request.ServiceId);

            if (existingLink)
            {
                _logger.LogInformation("Service {ServiceId} is already linked to Space {SpaceId}.", request.ServiceId, spaceId);
                // Có thể trả về thông tin link đã tồn tại hoặc null tùy logic
                var existingServiceSpace = await _context.ServiceSpaces
                    .Include(ss => ss.Service) // Để map ServiceName, Description vào DTO
                    .FirstOrDefaultAsync(ss => ss.SpaceId == spaceId && ss.ServiceId == request.ServiceId);
                return _mapper.Map<ServiceSpaceDto>(existingServiceSpace);
            }

            var serviceSpaceEntity = _mapper.Map<ServiceSpace>(request); // AutoMapper đã map PriceOverride
            serviceSpaceEntity.Id = Guid.NewGuid();
            serviceSpaceEntity.SpaceId = spaceId;
            // CreatedAt đã được map bởi AutoMapper từ DateTime.UtcNow trong profile

            try
            {
                await _context.ServiceSpaces.AddAsync(serviceSpaceEntity);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Service {ServiceId} added to Space {SpaceId} with PriceOverride {PriceOverride}.",
                    request.ServiceId, spaceId, request.PriceOverride);

                // Load lại entity với Service navigation property để map đúng ServiceName, etc.
                var createdServiceSpaceWithDetails = await _context.ServiceSpaces
                    .Include(ss => ss.Service)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(ss => ss.Id == serviceSpaceEntity.Id);

                return _mapper.Map<ServiceSpaceDto>(createdServiceSpaceWithDetails);
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "DB error adding service {ServiceId} to space {SpaceId}.", request.ServiceId, spaceId);
                throw;
            }
        }

        public async Task<ServiceSpaceDto?> UpdateServiceOnSpaceAsync(Guid spaceId, Guid serviceId, UpdateServiceOnSpaceDto request)
        {
            var serviceSpaceEntity = await _context.ServiceSpaces
                .Include(ss => ss.Service) // Include Service để có thể trả về thông tin đầy đủ sau khi map
                .FirstOrDefaultAsync(ss => ss.SpaceId == spaceId && ss.ServiceId == serviceId);

            if (serviceSpaceEntity == null)
            {
                _logger.LogWarning("Link between Space {SpaceId} and Service {ServiceId} not found for update.", spaceId, serviceId);
                return null;
            }

            _mapper.Map(request, serviceSpaceEntity); // AutoMapper cập nhật các trường non-null
            // UpdatedAt cho ServiceSpace có thể cần được xử lý (nếu entity ServiceSpace có trường UpdatedAt)

            try
            {
                await _context.SaveChangesAsync();
                _logger.LogInformation("Link details for Service {ServiceId} on Space {SpaceId} updated.", serviceId, spaceId);
                return _mapper.Map<ServiceSpaceDto>(serviceSpaceEntity);
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "DB error updating link for Service {ServiceId} on Space {SpaceId}.", serviceId, spaceId);
                throw;
            }
        }

        public async Task<bool> RemoveServiceFromSpaceAsync(Guid spaceId, Guid serviceId)
        {
            var serviceSpaceLink = await _context.ServiceSpaces
                .FirstOrDefaultAsync(ss => ss.SpaceId == spaceId && ss.ServiceId == serviceId);

            if (serviceSpaceLink == null)
            {
                _logger.LogWarning("Link between Space {SpaceId} and Service {ServiceId} not found for removal.", spaceId, serviceId);
                return false;
            }

            try
            {
                _context.ServiceSpaces.Remove(serviceSpaceLink);
                var result = await _context.SaveChangesAsync();
                if (result > 0)
                {
                    _logger.LogInformation("Service {ServiceId} removed from Space {SpaceId}.", serviceId, spaceId);
                    return true;
                }
                return false;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "DB error removing service {ServiceId} from space {SpaceId}.", serviceId, spaceId);
                throw;
            }
        }

        public async Task<List<ServiceSpaceDto>> GetServicesForSpaceAsync(Guid spaceId)
        {
            var spaceExists = await _context.Spaces.AnyAsync(s => s.Id == spaceId);
            if (!spaceExists)
            {
                _logger.LogWarning("Space with ID {SpaceId} not found when trying to get linked services.", spaceId);
                return new List<ServiceSpaceDto>();
            }

            var serviceSpaces = await _context.ServiceSpaces
                .Where(ss => ss.SpaceId == spaceId)
                .Include(ss => ss.Service) // Quan trọng: để lấy thông tin của Service (Name, Description)
                .OrderBy(ss => ss.Service.Name) // Sắp xếp theo tên Service
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<List<ServiceSpaceDto>>(serviceSpaces);
        }

        public async Task<ServiceSpaceDto?> GetServiceForSpaceAsync(Guid spaceId, Guid serviceId)
        {
            var serviceSpace = await _context.ServiceSpaces
                .Where(ss => ss.SpaceId == spaceId && ss.ServiceId == serviceId)
                .Include(ss => ss.Service)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (serviceSpace == null)
            {
                _logger.LogInformation("Link between Space {SpaceId} and Service {ServiceId} not found.", spaceId, serviceId);
                return null;
            }
            return _mapper.Map<ServiceSpaceDto>(serviceSpace);
        }
    }
}