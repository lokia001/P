using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting; // Import IWebHostEnvironment
using Microsoft.Extensions.Logging; // Import ILogger

namespace Backend.Api.Modules.SpaceService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _clientFactory;
        private readonly IWebHostEnvironment _environment; // Inject IWebHostEnvironment
        private readonly ILogger<UploadController> _logger;

        public UploadController(IConfiguration configuration, IHttpClientFactory clientFactory, IWebHostEnvironment environment, ILogger<UploadController> logger)
        {
            _configuration = configuration;
            _clientFactory = clientFactory;
            _environment = environment;
            _logger = logger;
        }

        [HttpPost("uploadImages")]
        public async Task<IActionResult> UploadImages(List<IFormFile> files)
        {
            try
            {
                var imageUrls = new List<string>();
                string apiKey = _configuration["ImgBB:ApiKey"]; // Lấy API key từ appsettings.json (tùy chọn)
                string uploadPath = Path.Combine(_environment.WebRootPath, "images"); // Đường dẫn đến thư mục public/images

                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                    _logger.LogInformation($"Created directory: {uploadPath}");
                }

                foreach (var file in files)
                {
                    if (file != null && file.Length > 0)
                    {
                        string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                        string filePath = Path.Combine(uploadPath, fileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }

                        // Tạo URL tương đối để truy cập hình ảnh
                        string imageUrl = $"/images/{fileName}";
                        imageUrls.Add(imageUrl);
                        _logger.LogInformation($"Uploaded image: {imageUrl}");
                    }
                }

                return Ok(new { message = "Images uploaded successfully", imageUrls });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Upload failed");
                return StatusCode(500, new { message = "Upload failed", error = ex.Message });
            }
        }
    }
}