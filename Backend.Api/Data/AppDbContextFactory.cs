
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Backend.Api.Data
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var environmentName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
            var basePath = Directory.GetCurrentDirectory(); // Điều chỉnh đường dẫn nếu cần
            Console.WriteLine($"===>[AppDbContextFactory] BasePath for configuration: {basePath}");

            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{environmentName}.json", optional: true) // Load file cấu hình theo môi trường
.AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            Console.WriteLine($"===> [AppDbContextFactory] Connection string from factory: {connectionString}");
            optionsBuilder.UseSqlite(connectionString); // Hoặc provider bạn dùng

            return new AppDbContext(optionsBuilder.Options);
        }
    }
}