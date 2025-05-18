namespace Backend.Api.Modules.ReactionService.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Backend.Api.Modules.ReactionService.Services;
using Backend.Api.Data;

public static class ReactionServiceExtensions
{
    public static IServiceCollection AddReactionServiceModule(this IServiceCollection services, IConfiguration configuration)
    {
        // services.AddDbContext<ReactionDbContext>(options =>
        //     options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IReactionService, ReactionService>();

        services.AddControllers();

        return services;
    }
}