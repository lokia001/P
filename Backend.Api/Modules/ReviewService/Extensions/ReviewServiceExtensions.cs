namespace Backend.Api.Modules.ReviewService.Extensions;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Backend.Api.Modules.ReviewService.Services;
using Backend.Api.Data;

public static class ReviewServiceExtensions
{
    public static IServiceCollection AddReviewServiceModule(this IServiceCollection services, IConfiguration configuration)
    {
        // services.AddDbContext<ReviewDbContext>(options =>
        //     options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IReviewService, ReviewService>();

        services.AddControllers();

        return services;
    }
}