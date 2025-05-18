// File: Backend.Api/Modules/ServiceService/Mappings/ServiceMappingProfile.cs
using AutoMapper;
using Backend.Api.Modules.ServiceService.Entities; // Namespace của ServiceEntity
using Backend.Api.Modules.ServiceService.Dtos.Service;   // Namespace của Service DTOs
using System; // For DateTime

namespace Backend.Api.Modules.ServiceService.Mappings
{
    public class ServiceMappingProfile : Profile
    {
        public ServiceMappingProfile()
        {
            // Map từ ServiceEntity sang ServiceResponseDto
            CreateMap<ServiceEntity, ServiceResponseDto>();

            // Map từ CreateServiceRequestDto sang ServiceEntity
            CreateMap<CreateServiceRequestDto, ServiceEntity>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // ID sẽ được tạo bởi DB/service
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.ServiceSpaces, opt => opt.Ignore()); // Collection này không được tạo từ DTO này

            // Map từ UpdateServiceRequestDto sang ServiceEntity
            CreateMap<UpdateServiceRequestDto, ServiceEntity>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // Không cho phép cập nhật ID
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Không cập nhật CreatedAt
                .ForMember(dest => dest.ServiceSpaces, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow)) // Cập nhật thời gian Update
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null)); // Chỉ map các trường non-null từ DTO
        }
    }
}