// File: Backend.Api/Modules/ServiceService/Services/ServiceEntityService.cs
using AutoMapper;
using Backend.Api.Data;
using Backend.Api.Modules.ServiceService.Dtos.Service;
using Backend.Api.Modules.ServiceService.Entities; // Sử dụng ServiceEntity
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// using Backend.Api.Data; // Namespace DbContext

namespace Backend.Api.Modules.ServiceService.Services
{
    public class ServiceEntityService : IServiceEntityService
    {
        private readonly AppDbContext _context; // THAY AppDbContext BẰNG TÊN DbContext CỦA BẠN
        private readonly IMapper _mapper;
        private readonly ILogger<ServiceEntityService> _logger;

        public ServiceEntityService(AppDbContext context, IMapper mapper, ILogger<ServiceEntityService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<ServiceResponseDto> CreateServiceAsync(CreateServiceRequestDto request)
        {
            // Kiểm tra trùng tên nếu cần
            var existingService = await _context.Services // Giả sử DbSet tên là Services và map tới ServiceEntity
                .FirstOrDefaultAsync(s => s.Name.ToLower() == request.Name.ToLower());
            if (existingService != null)
            {
                _logger.LogWarning("Attempted to create a service with a duplicate name: {ServiceName}", request.Name);
                throw new InvalidOperationException($"A service with the name '{request.Name}' already exists.");
            }

            var serviceEntity = _mapper.Map<ServiceEntity>(request);
            // Id, CreatedAt đã được xử lý bởi AutoMapper hoặc sẽ được DB gán

            try
            {
                await _context.Services.AddAsync(serviceEntity);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Service '{ServiceName}' created with ID {ServiceId}.", serviceEntity.Name, serviceEntity.Id);
                return _mapper.Map<ServiceResponseDto>(serviceEntity);
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "DB error creating service '{ServiceName}'.", request.Name);
                throw; // Hoặc xử lý cụ thể hơn
            }
            // Bỏ catch (Exception ex) chung nếu muốn để middleware xử lý lỗi chung xử lý
        }

        public async Task<ServiceResponseDto?> GetServiceByIdAsync(Guid serviceId)
        {
            var serviceEntity = await _context.Services.AsNoTracking().FirstOrDefaultAsync(s => s.Id == serviceId);
            if (serviceEntity == null)
            {
                _logger.LogInformation("Service with ID {ServiceId} not found.", serviceId);
                return null;
            }
            return _mapper.Map<ServiceResponseDto>(serviceEntity);
        }

        public async Task<List<ServiceResponseDto>> GetAllServicesAsync()
        {
            var serviceEntities = await _context.Services
                                                .AsNoTracking()
                                                .OrderBy(s => s.Name)
                                                .ToListAsync();
            return _mapper.Map<List<ServiceResponseDto>>(serviceEntities);
        }

        public async Task<ServiceResponseDto?> UpdateServiceAsync(Guid serviceId, UpdateServiceRequestDto request)
        {
            var serviceEntity = await _context.Services.FindAsync(serviceId);
            if (serviceEntity == null)
            {
                _logger.LogWarning("Service with ID {ServiceId} not found for update.", serviceId);
                return null;
            }

            // Kiểm tra trùng tên nếu tên được cập nhật và khác tên cũ
            if (!string.IsNullOrEmpty(request.Name) && request.Name.ToLower() != serviceEntity.Name.ToLower())
            {
                var existingServiceWithNewName = await _context.Services
                    .FirstOrDefaultAsync(s => s.Name.ToLower() == request.Name.ToLower() && s.Id != serviceId);
                if (existingServiceWithNewName != null)
                {
                    _logger.LogWarning("Attempted to update service {ServiceId} to a duplicate name: {NewServiceName}", serviceId, request.Name);
                    throw new InvalidOperationException($"A service with the name '{request.Name}' already exists.");
                }
            }

            _mapper.Map(request, serviceEntity); // AutoMapper cập nhật các trường non-null
                                                 // UpdatedAt được xử lý bởi AutoMapper profile

            try
            {
                // _context.Services.Update(serviceEntity); // Không cần thiết nếu entity đã được tracked
                await _context.SaveChangesAsync();
                _logger.LogInformation("Service {ServiceId} - '{ServiceName}' updated.", serviceEntity.Id, serviceEntity.Name);
                return _mapper.Map<ServiceResponseDto>(serviceEntity);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency error while updating Service {ServiceId}.", serviceId);
                throw;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "DB error updating service {ServiceId}.", serviceId);
                throw;
            }
        }

        public async Task<bool> DeleteServiceAsync(Guid serviceId)
        {
            var serviceEntity = await _context.Services
                                              .Include(s => s.ServiceSpaces) // Để kiểm tra service có đang được dùng không
                                              .FirstOrDefaultAsync(s => s.Id == serviceId);
            if (serviceEntity == null)
            {
                _logger.LogWarning("Service with ID {ServiceId} not found for deletion.", serviceId);
                return false;
            }

            if (serviceEntity.ServiceSpaces != null && serviceEntity.ServiceSpaces.Any())
            {
                _logger.LogWarning("Attempt to delete service {ServiceId} - '{ServiceName}' which is currently associated with spaces.", serviceId, serviceEntity.Name);
                throw new InvalidOperationException($"Service '{serviceEntity.Name}' cannot be deleted as it is currently in use by one or more spaces.");
            }

            try
            {
                _context.Services.Remove(serviceEntity);
                var result = await _context.SaveChangesAsync();
                if (result > 0)
                {
                    _logger.LogInformation("Service {ServiceId} - '{ServiceName}' deleted.", serviceId, serviceEntity.Name);
                    return true;
                }
                _logger.LogWarning("Service {ServiceId} was found but not removed (SaveChangesAsync returned 0).", serviceId);
                return false;
            }
            catch (DbUpdateException dbEx)
            {
                _logger.LogError(dbEx, "DB error deleting service {ServiceId}.", serviceId);
                throw; // Hoặc xử lý cụ thể hơn
            }
        }
    }
}