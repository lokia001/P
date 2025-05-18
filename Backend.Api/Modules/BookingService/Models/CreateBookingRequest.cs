using System.ComponentModel.DataAnnotations;

namespace Backend.Api.Modules.BookingService.Models;

public class CreateBookingRequest
{
    [Required]
    public Guid SpaceId { get; set; }
    [Required]
    public Guid UserId { get; set; }
    [Required]
    public DateTime StartDate { get; set; }
    [Required]
    public DateTime EndDate { get; set; }
    [Required]
    public int NumberOfGuests { get; set; }
}