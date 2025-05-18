using Backend.Api.Modules.BookingService.Entities;
using Microsoft.EntityFrameworkCore;
using Backend.Api.Data;
namespace Backend.Api.Modules.BookingService.Services;

public class BookingService : IBookingService
{
    private readonly AppDbContext _dbContext;

    public BookingService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Booking?> GetBookingByIdAsync(Guid id)
    {
        return null;
    }

    public async Task<List<Booking>> GetAllBookingsAsync()
    {
        return [];
    }

    public async Task<Booking?> CreateBookingAsync(Booking booking)
    {
        _dbContext.Bookings.Add(booking);
        await _dbContext.SaveChangesAsync();
        return booking;
    }

    public async Task<bool> CancelBookingAsync(Guid id)
    {
        var booking = await _dbContext.Bookings.FindAsync(id);
        if (booking == null)
        {
            return false;
        }

        booking.BookingStatus = BookingStatus.Cancelled;
        _dbContext.Bookings.Update(booking);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ConfirmBookingAsync(Guid id)
    {
        var booking = await _dbContext.Bookings.FindAsync(id);
        if (booking == null)
        {
            return false;
        }

        booking.BookingStatus = BookingStatus.Confirmed;
        _dbContext.Bookings.Update(booking);
        await _dbContext.SaveChangesAsync();
        return true;
    }

}