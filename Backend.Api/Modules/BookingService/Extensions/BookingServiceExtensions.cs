using Backend.Api.Modules.BookingService.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
namespace Backend.Api.Modules.BookingService.Extensions;

using Backend.Api.Modules.BookingService.Services;

public static class BookingServiceExtensions
{
    public static IServiceCollection AddBookingServiceModule(this IServiceCollection services, IConfiguration configuration)
    {
        // services.AddDbContext<BookingDbContext>(options =>
        //     options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddScoped<IBookingService, BookingService>();

        services.AddControllers();

        return services;
    }
}