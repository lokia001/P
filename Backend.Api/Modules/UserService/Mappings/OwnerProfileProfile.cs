// Backend.Api/Modules/UserService/Mappings/OwnerProfileProfile.cs
using AutoMapper;
using Backend.Api.Modules.UserService.Models;
using Backend.Api.Modules.UserService.Entities;

namespace Backend.Api.Modules.UserService.Mappings
{
    public class OwnerProfileProfile : Profile
    {
        public OwnerProfileProfile()
        {
            // --- Mapping từ Entity OwnerProfile sang OwnerProfileDto ---
            CreateMap<OwnerProfile, OwnerProfileDto>();
            // Tất cả các thuộc tính có tên giống nhau sẽ được map tự động.
            // UserId, CompanyName, ContactInfo, etc.
            // Navigation property 'User' trong OwnerProfile sẽ không được map vào OwnerProfileDto
            // vì OwnerProfileDto không có thuộc tính User (để tránh tham chiếu vòng).

            // --- (Tùy chọn) Mapping từ CreateOwnerProfileDto/UpdateOwnerProfileDto sang OwnerProfile Entity ---
            // Ví dụ:
            // CreateMap<CreateOwnerProfileDto, OwnerProfile>();
            // CreateMap<UpdateOwnerProfileDto, OwnerProfile>()
            //     .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}