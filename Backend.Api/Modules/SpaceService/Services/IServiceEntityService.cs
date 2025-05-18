// File: Backend.Api/Modules/ServiceService/Services/IServiceEntityService.cs
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Api.Modules.ServiceService.Dtos.Service; // Namespace của Service DTOs

namespace Backend.Api.Modules.ServiceService.Services
{
    public interface IServiceEntityService // Đổi tên từ IService để tránh xung đột
    {
        Task<ServiceResponseDto> CreateServiceAsync(CreateServiceRequestDto request);
        Task<ServiceResponseDto?> GetServiceByIdAsync(Guid serviceId);
        Task<List<ServiceResponseDto>> GetAllServicesAsync();
        Task<ServiceResponseDto?> UpdateServiceAsync(Guid serviceId, UpdateServiceRequestDto request);
        Task<bool> DeleteServiceAsync(Guid serviceId);
    }
}