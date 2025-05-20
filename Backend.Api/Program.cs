using Backend.Api.Modules.UserService.Extensions;
using Backend.Api.Modules.SpaceService.Extensions;
using Backend.Api.Modules.BookingService.Extensions;
using Backend.Api.Modules.PaymentService.Extensions;
using Backend.Api.Modules.ReviewService.Extensions;
using Backend.Api.Modules.CommunityService.Extensions;
using Backend.Api.Modules.PostService.Extensions;
using Backend.Api.Modules.CommentService.Extensions;
using Backend.Api.Modules.ReactionService.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Backend.Api.Security;
using Backend.Api.Data;
using Backend.Api.Modules.UserService.Services;
using Backend.Api.Modules.UserService.Controllers;
using Backend.Api.Modules.UserService.Services;
using Backend.Api.Modules.SpaceService.Services;
using System.Security.Claims;
using Microsoft.Extensions.DependencyInjection;
using Backend.Api.Services.Auth;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.OpenApi.Models;
using Backend.Api.Modules.ServiceService.Services;
using Backend.Api.Services;
using Backend.Api.Modules.AuthService.Services;
using Backend.Api.Services.Shared;
using DotNetEnv;

#if DEBUG
Env.Load(); // Tải file .env ở thư mục gốc của project
// Hoặc Env.Load(Path.Combine(Directory.GetCurrentDirectory(), ".env")); nếu cần đường dẫn cụ thể
#endif
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAutoMapper(typeof(Program).Assembly);


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options => // Tham số options là SwaggerGenOptions
{
    // 1. Định nghĩa một scheme bảo mật (Security Scheme) cho JWT
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        // Mô tả cho scheme bảo mật
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n " +
                      "Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\n" +
                      "Example: \"Bearer 12345abcdef\"",
        Name = "Authorization", // Tên của header chứa token
        In = ParameterLocation.Header, // Vị trí của token (trong header)
        Type = SecuritySchemeType.Http, // Loại scheme bảo mật
        Scheme = "bearer", // Scheme được sử dụng (quan trọng, phải là "bearer" cho JWT Bearer)
        BearerFormat = "JWT" // Định dạng của bearer token
    });

    // 2. Yêu cầu bảo mật (Security Requirement) cho các endpoint
    // Điều này sẽ thêm nút "Authorize" và áp dụng scheme "Bearer" cho các request
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            // Tham chiếu đến scheme bảo mật đã định nghĩa ở trên
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme, // Loại tham chiếu là SecurityScheme
                    Id = "Bearer" // ID của scheme bảo mật (phải khớp với tên đã định nghĩa trong AddSecurityDefinition)
                },
                // Các thuộc tính này có thể không cần thiết khi chỉ tham chiếu,
                // nhưng đôi khi Swagger UI cần chúng để hiển thị đúng.
                // Scheme = "oauth2", // Hoặc "bearer"
                // Name = "Bearer",
                // In = ParameterLocation.Header,
            },
            new List<string>() // Danh sách các scope (để trống nếu không dùng OAuth2 scopes cụ thể)
        }
    });

    // (Tùy chọn) Thêm thông tin mô tả cho API của bạn
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "My API",
        Description = "An ASP.NET Core Web API for managing my application",
        // TermsOfService = new Uri("https://example.com/terms"),
        // Contact = new OpenApiContact
        // {
        //     Name = "Your Name",
        //     Email = "your.email@example.com",
        //     Url = new Uri("https://example.com/contact"),
        // },
        // License = new OpenApiLicense
        // {
        //     Name = "Use under LICX",
        //     Url = new Uri("https://example.com/license"),
        // }
    });

    // (Tùy chọn) Nếu bạn muốn hiển thị XML comments trong Swagger UI:
    // var xmlFilename = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    // options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

// Configuration
var configuration = builder.Configuration;
Console.WriteLine($"Running in: {configuration}");

// Add HttpClientFactory
builder.Services.AddHttpClient(); //Thêm cái này
builder.Services.AddHttpClient<IIBBService, IBBService>();
// Add Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("_myAllowSpecificOrigins",
        builder => builder.WithOrigins("http://localhost:5173")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials());
});

// builder.Services.AddSingleton<IWebHostEnvironment>(builder.Environment);


// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseSqlite(configuration.GetConnectionString("DefaultConnection"))
//     );



// Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
        };
    }
    );
////;;
;
// Authorization policy
builder.Services.AddAuthorization();

// Add custom authorization handler
builder.Services.AddScoped<IAuthorizationHandler, MinimumAgeAuthorizationHandler>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<ILogger<UsersController>, Logger<UsersController>>();  //Quan trọng :Logging
builder.Services.AddScoped<ISpaceService, SpaceService>();
builder.Services.AddScoped<IAmenityService, AmenityService>();
builder.Services.AddScoped<IServiceEntityService, ServiceEntityService>();
builder.Services.AddScoped<ISpaceAmenityManagementService, SpaceAmenityManagementService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();
builder.Services.AddScoped<IEmailService, EmailService>(); // Hoặc AddTransient
// Add modules:
builder.Services.AddUserServiceModule(configuration);
builder.Services.AddSpaceServiceModule(configuration);
builder.Services.AddBookingServiceModule(configuration);
builder.Services.AddPaymentServiceModule(configuration);
builder.Services.AddReviewServiceModule(configuration);
builder.Services.AddCommunityServiceModule(configuration);
builder.Services.AddPostServiceModule(configuration);
builder.Services.AddCommentServiceModule(configuration);
builder.Services.AddReactionServiceModule(configuration);


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Console.WriteLine($"====> Connection String: {connectionString}");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString)
    );

var app = builder.Build();

if (app.Environment.IsProduction())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}


var startupLogger = app.Services.GetRequiredService<ILogger<Program>>(); // Logger cho Program.cs
try
{
    startupLogger.LogInformation("Application starting up. Initializing database...");

    // Cách 1: Nếu InitializeDatabaseAsync nhận IApplicationBuilder
    // await DatabaseInitializer.InitializeDatabaseAsync(app);

    // Cách 2: Nếu SeedDataAsync nhận IServiceProvider (như phiên bản đã sửa)
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        // var dbContext = services.GetRequiredService<AppDbContext>();
        // await dbContext.Database.MigrateAsync(); // Nếu cần migrate

        await DatabaseInitializer.SeedDataAsync(services); // Gọi hàm này
    }
    startupLogger.LogInformation("Database initialization and seeding complete.");
}
catch (Exception ex)
{
    startupLogger.LogCritical(ex, "Application startup failed due to an error during database initialization/seeding.");
    throw;
}
// =======================================================================
// KẾT THÚC GỌI SEEDING
// =======================================================================


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); //Thêm
    app.UseSwagger();

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Backend API v1");
        c.RoutePrefix = "swagger";
    });
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<Program>>();
        var env = services.GetRequiredService<IWebHostEnvironment>();
        // Automatic Migration
        // app.SeedDatabase(env);
    }
}


app.UseHttpsRedirection();
// ✅ Đặt ngay sau HTTPS và trước Auth
app.UseCors("_myAllowSpecificOrigins");
app.UseAuthentication();
app.UseAuthorization();
// Enable Cors

app.MapControllers(); // Ensure controllers are mapped in all environments

app.Run();