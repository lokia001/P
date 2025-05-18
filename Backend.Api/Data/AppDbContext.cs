// Backend.Api/Data/AppDbContext.cs // Đường dẫn có thể khác tùy thuộc vào cấu trúc dự án của bạn
using Backend.Api.Modules.BookingService.Entities;
using Backend.Api.Modules.PaymentService.Entities;
using Backend.Api.Modules.ReviewService.Entities;
using Backend.Api.Modules.SpaceService.Entities;
using Backend.Api.Modules.UserService.Entities; // Nếu bạn có entity User ở đây
using Backend.Api.Modules.SpaceService.Configurations; // Namespace chứa các file cấu hình của SpaceService
// using Backend.Api.Modules.PaymentService.Configurations; // Namespace chứa file cấu hình của PaymentService
// using Backend.Api.Modules.ReviewService.Configurations;   // Namespace chứa file cấu hình của ReviewService

// Các namespace cấu hình khác nếu có

using Microsoft.EntityFrameworkCore;
using Backend.Api.Data.Configurations;
using Backend.Api.Modules.SpaceService.Services;
using Backend.Api.Modules.ServiceService.Entities;
using Backend.Api.Modules.ServiceService.Data.Configurations;
using Backend.Api.Modules.AuthService.Entities;
namespace Backend.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        #region DbSet Properties
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Booking> Bookings { get; set; } = default!;
        public DbSet<OwnerProfile> OwnerProfiles { get; set; } = default!;
        public DbSet<Space> Spaces { get; set; } = default!;
        public DbSet<SpaceImage> SpaceImages { get; set; } = default!;

        public DbSet<ServiceSpace> ServiceSpaces { get; set; } = default!;
        public DbSet<ServiceEntity> Services { get; set; }

        public DbSet<Amenity> Amenities { get; set; } = default!;
        public DbSet<SpaceAmenity> SpaceAmenities { get; set; } = default!;


        // public DbSet<Payment> Payments { get; set; } = default!;
        // public DbSet<Review> Reviews { get; set; } = default!;
        public DbSet<User> Users { get; set; } = default!;

        #endregion

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            #region Apply Entity Configurations

            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new OwnerProfileConfiguration());

            modelBuilder.ApplyConfiguration(new SpaceConfiguration());
            modelBuilder.ApplyConfiguration(new SpaceImageConfiguration());
            modelBuilder.ApplyConfiguration(new SpaceAmenityConfiguration());
            modelBuilder.ApplyConfiguration(new SpaceServiceConfiguration());
            modelBuilder.ApplyConfiguration(new ServiceEntityConfiguration());
            // modelBuilder.ApplyConfiguration(new SpaceServiceConfiguration());
            // modelBuilder.ApplyConfiguration(new SpaceDamageReportConfiguration());
            // modelBuilder.ApplyConfiguration(new PaymentConfiguration());
            // modelBuilder.ApplyConfiguration(new ReviewConfiguration());

            modelBuilder.ApplyConfiguration(new BookingConfiguration());
            // Ví dụ: modelBuilder.ApplyConfiguration(new SomeOtherEntityConfiguration());



            #endregion
        }
    }
}