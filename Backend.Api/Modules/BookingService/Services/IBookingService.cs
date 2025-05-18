using Backend.Api.Modules.BookingService.Entities;

namespace Backend.Api.Modules.BookingService.Services;

public interface IBookingService
{
    Task<Booking?> GetBookingByIdAsync(Guid id);
    Task<List<Booking>> GetAllBookingsAsync();
    Task<Booking?> CreateBookingAsync(Booking booking);
    Task<bool> CancelBookingAsync(Guid id);
    Task<bool> ConfirmBookingAsync(Guid id);

}