// Backend.Api/Data/DatabaseInitializer.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging; // Namespace cho ILoggerFactory và ILogger
using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Api.Modules.UserService.Entities;

namespace Backend.Api.Data
{
    public static class DatabaseInitializer
    {
        // Tên category cho logger
        private const string LoggerCategoryName = "Backend.Api.Data.DatabaseInitializer";

        public static async Task InitializeDatabaseAsync(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var serviceProvider = serviceScope.ServiceProvider;
                await SeedDataAsync(serviceProvider);
            }
        }

        public static async Task SeedDataAsync(IServiceProvider serviceProvider)
        {
            // Lấy ILoggerFactory để tạo logger
            var loggerFactory = serviceProvider.GetRequiredService<ILoggerFactory>();
            var logger = loggerFactory.CreateLogger(LoggerCategoryName); // Tạo logger với category name tùy chỉnh
            // Hoặc bạn có thể dùng: var logger = loggerFactory.CreateLogger("DatabaseInitializer");

            try
            {
                logger.LogInformation("Attempting to seed database...");
                var dbContext = serviceProvider.GetRequiredService<AppDbContext>();

                // (Tùy chọn) Áp dụng migrations
                // logger.LogInformation("Ensuring database is migrated/created...");
                // await dbContext.Database.MigrateAsync();

                await SeedSysAdminUserInternalAsync(dbContext, logger); // Truyền logger đã tạo

                logger.LogInformation("Database seeding completed successfully.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while initializing or seeding the database.");
                throw; // Re-throw để app biết có lỗi nghiêm trọng khi khởi động
            }
        }

        // Phương thức này giờ nhận ILogger thay vì ILogger<DatabaseInitializer>
        private static async Task SeedSysAdminUserInternalAsync(AppDbContext dbContext, ILogger logger)
        {
            const string sysAdminUsername = "sysadmin";
            const string sysAdminEmail = "sysadmin@example.com";
            const string sysAdminDefaultPassword = "P@$$wOrdS123!"; // NHỚ THAY ĐỔI TRONG PRODUCTION

            if (!await dbContext.Users.AnyAsync(u => u.Role == Role.SysAdmin || u.Username == sysAdminUsername))
            {
                logger.LogInformation("SysAdmin user not found. Creating one with Username: {Username}", sysAdminUsername);

                var sysAdminUser = new User
                {
                    Id = Guid.NewGuid(),
                    Username = sysAdminUsername,
                    Email = sysAdminEmail,
                    FullName = "System Administrator",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(sysAdminDefaultPassword),
                    Role = Role.SysAdmin,
                    CreatedAt = DateTime.UtcNow,
                };

                await dbContext.Users.AddAsync(sysAdminUser);
                await dbContext.SaveChangesAsync();

                logger.LogInformation("SysAdmin user created successfully.");
            }
            else
            {
                logger.LogInformation("SysAdmin user already exists.");
            }
        }
    }
}