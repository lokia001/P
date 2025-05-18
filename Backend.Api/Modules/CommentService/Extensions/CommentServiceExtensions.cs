namespace Backend.Api.Modules.CommentService.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Backend.Api.Modules.CommentService.Services;


public static class CommentServiceExtensions
{
    public static IServiceCollection AddCommentServiceModule(this IServiceCollection services, IConfiguration configuration)
    {
        // services.AddDbContext<CommentDbContext>(options =>
        //     options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<ICommentService, CommentService>();

        services.AddControllers();

        return services;
    }
}