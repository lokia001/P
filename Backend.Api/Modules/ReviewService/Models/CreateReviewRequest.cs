using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.ReviewService.Models;

public class CreateReviewRequest
{
    [Required]
    public Guid SpaceId { get; set; }
    [Required]
    public Guid UserId { get; set; }
    [Required]
    public Guid BookingId { get; set; }
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }
    public string? Comment { get; set; }
}