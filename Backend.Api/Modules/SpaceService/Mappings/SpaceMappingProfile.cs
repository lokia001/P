using AutoMapper;
using Backend.Api.Modules.SpaceService.Entities;
using Backend.Api.Modules.SpaceService.Dtos.Space;
using Backend.Api.Modules.SpaceService.Dtos.Amenity;
using Backend.Api.Modules.SpaceService.Dtos.ServiceSpace;
using System.Linq; // Required for .Select()

namespace Backend.Api.Modules.SpaceService.Mappings
{
    public class SpaceMappingProfile : Profile
    {
        public SpaceMappingProfile()
        {
            // --- Space Mappings ---
            CreateMap<CreateSpaceWithDetailsRequestDto, Space>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                // SỬA LỖI 1: Dùng MapFrom cho giá trị cố định
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => SpaceStatus.Available))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.OwnerProfileId, opt => opt.Ignore())
                .ForMember(dest => dest.LastEditedByUserId, opt => opt.Ignore())
                .ForMember(dest => dest.SpaceImages, opt => opt.Ignore())
                .ForMember(dest => dest.SpaceAmenities, opt => opt.Ignore())
                .ForMember(dest => dest.ServiceSpaces, opt => opt.Ignore())
                .ForMember(dest => dest.Bookings, opt => opt.Ignore());





            CreateMap<Space, SpaceResponseDto>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.SpaceImages))
                .ForMember(dest => dest.Amenities, opt => opt.MapFrom(src =>
                    src.SpaceAmenities != null ? src.SpaceAmenities.Select(sa => sa.Amenity) : Enumerable.Empty<Amenity>()))
                .ForMember(dest => dest.Services, opt => opt.MapFrom(src => src.ServiceSpaces))
                .ForMember(dest => dest.OwnerProfileId, opt => opt.MapFrom(src => src.OwnerProfileId)); ;
            // Giả sử bạn sẽ có UpdateSpaceRequestDto riêng cho việc cập nhật Space cơ bản
            // CreateMap<UpdateSpaceRequestDto, Space>()
            //     .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));


            // --- SpaceImage Mappings ---
            CreateMap<SpaceImage, SpaceImageResponseDto>();
            CreateMap<CreateSpaceImageRequestDto, SpaceImage>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.SpaceId, opt => opt.Ignore()); // Sẽ được set trong service
            CreateMap<UpdateSpaceImageRequestDto, SpaceImage>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // ID không nên thay đổi từ DTO
                .ForMember(dest => dest.SpaceId, opt => opt.Ignore()) // SpaceId không nên thay đổi
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // --- Amenity Mappings ---
            CreateMap<Amenity, AmenityDto>();
            CreateMap<CreateAmenityDto, Amenity>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<UpdateAmenityDto, Amenity>()
                .ForMember(dest => dest.Id, opt => opt.Ignore()) // ID không nên thay đổi từ DTO
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            // --- SpaceAmenity Mappings (Bảng nối) ---
            // Mapping từ SpaceAmenity (entity) sang SpaceAmenityDto (nếu bạn dùng DTO này)
            // Thường thì client sẽ quan tâm đến danh sách AmenityDto hơn là SpaceAmenityDto.
            CreateMap<SpaceAmenity, SpaceAmenityDto>()
                .ForMember(dest => dest.AmenityName, opt => opt.MapFrom(src => src.Amenity != null ? src.Amenity.Name : null))
                .ForMember(dest => dest.AmenityDescription, opt => opt.MapFrom(src => src.Amenity != null ? src.Amenity.Description : null));

            // --- ServiceSpace Mappings (Bảng nối) ---
            CreateMap<ServiceSpace, ServiceSpaceDto>()
                .ForMember(dest => dest.ServiceName, opt => opt.MapFrom(src => src.Service != null ? src.Service.Name : null))
                .ForMember(dest => dest.ServiceDescription, opt => opt.MapFrom(src => src.Service != null ? src.Service.Description : null))
                // Nếu ServiceSpaceDto có PriceOverride, map từ ServiceSpace.PriceOverride
                .ForMember(dest => dest.PriceOverride, opt => opt.MapFrom(src => src.PriceOverride));


            // Mapping từ DTO để tạo mới liên kết ServiceSpace
            // Giả định AddServiceToSpaceDto có PriceOverride
            CreateMap<AddServiceToSpaceDto, ServiceSpace>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.SpaceId, opt => opt.Ignore()) // Sẽ được set trong service
                .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
                .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes))
                .ForMember(dest => dest.IsIncludedInBasePrice, opt => opt.MapFrom(src => src.IsIncludedInBasePrice))
                .ForMember(dest => dest.PriceOverride, opt => opt.MapFrom(src => src.PriceOverride)) // Map từ DTO
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            // Mapping từ DTO để cập nhật liên kết ServiceSpace
            CreateMap<UpdateServiceOnSpaceDto, ServiceSpace>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.SpaceId, opt => opt.Ignore())
                .ForMember(dest => dest.ServiceId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                // Giả sử UpdateServiceOnSpaceDto có PriceOverride?
                .ForMember(dest => dest.PriceOverride, opt => opt.Condition(src => src.PriceOverride.HasValue))
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null)); // Áp dụng cho các trường còn lại như Notes, IsIncludedInBasePrice

            // Mapping cho SpaceServiceCreationDto (từ request body) sang AddServiceToSpaceDto (để dùng với service)
            // Giả định AddServiceToSpaceDto có PriceOverride
            CreateMap<SpaceServiceCreationDto, AddServiceToSpaceDto>()
                .ForMember(dest => dest.ServiceId, opt => opt.MapFrom(src => src.ServiceId))
                .ForMember(dest => dest.PriceOverride, opt => opt.MapFrom(src => src.Price))
                .ForMember(dest => dest.Notes, opt => opt.NullSubstitute(null))
                // SỬA LỖI 1: Dùng MapFrom cho giá trị cố định
                .ForMember(dest => dest.IsIncludedInBasePrice, opt => opt.MapFrom(src => false));
        }
    }
}