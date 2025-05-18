namespace Backend.Api.Modules.CommunityService.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Backend.Api.Modules.CommunityService.Services;
using Backend.Api.Data;

public static class CommunityServiceExtensions
{
    public static IServiceCollection AddCommunityServiceModule(this IServiceCollection services, IConfiguration configuration)
    {
        // services.AddDbContext<CommunityDbContext>(options =>
        //     options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<ICommunityService, CommunityService>();

        services.AddControllers();

        return services;
    }
}