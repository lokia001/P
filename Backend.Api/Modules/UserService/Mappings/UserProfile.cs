// Backend.Api/Modules/UserService/Mappings/UserProfile.cs
using AutoMapper;
using Backend.Api.Modules.UserService.Models; // Namespace của DTOs
using Backend.Api.Modules.UserService.Entities; // Namespace của Entities

namespace Backend.Api.Modules.UserService.Mappings
{
    public class UserProfile : Profile // Kế thừa từ AutoMapper.Profile
    {
        public UserProfile()
        {
            // --- Mapping từ Entity User sang UserDto ---
            CreateMap<User, UserDto>()
                // Xử lý các thuộc tính Enum thành string
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()))
                .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender.ToString()))
                // AutoMapper sẽ tự động map OwnerProfile (Entity) sang OwnerProfileDto (DTO)
                // nếu có một mapping profile tương ứng cho OwnerProfile (sẽ tạo ở dưới)
                .ForMember(dest => dest.OwnerProfile, opt => opt.MapFrom(src => src.OwnerProfile));
            // Các thuộc tính có tên giống nhau sẽ được map tự động (ví dụ: Id, FullName, Email, Bio, ...)
            // PasswordHash không có trong UserDto nên sẽ không được map (đây là điều tốt)

            // --- (Tùy chọn) Mapping từ CreateUserDto/UpdateUserDto sang User Entity ---
            // Ví dụ: (Bạn sẽ tạo các DTO này sau nếu cần)
            // CreateMap<CreateUserDto, User>()
            //     .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // PasswordHash sẽ được xử lý riêng
            //     .ForMember(dest => dest.Role, opt => opt.MapFrom(src => Enum.Parse<Role>(src.Role, true))) // Chuyển string Role từ DTO thành Enum
            //     .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => Enum.Parse<Gender>(src.Gender, true)));

            // CreateMap<UpdateUserDto, User>()
            //     .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null)); // Chỉ map các thuộc tính không null từ DTO
        }
    }
}