namespace Backend.Api.Modules.PostService.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Backend.Api.Modules.PostService.Services;
using Backend.Api.Data;

public static class PostServiceExtensions
{
    public static IServiceCollection AddPostServiceModule(this IServiceCollection services, IConfiguration configuration)
    {
        // services.AddDbContext<PostDbContext>(options =>
        //     options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IPostService, PostService>();

        services.AddControllers();

        return services;
    }
}