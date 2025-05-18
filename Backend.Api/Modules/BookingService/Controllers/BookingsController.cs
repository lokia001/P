using Microsoft.AspNetCore.Mvc;
using Backend.Api.Modules.BookingService.Models;
using System;
using System.Collections.Generic;
using Backend.Api.Modules.BookingService.Entities;

namespace Backend.Api.Modules.BookingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetBookings(int count = 5)
    {/////
        return null;
    }
}

// using Backend.Api.Modules.BookingService.Entities;
// using Backend.Api.Modules.BookingService.Models;
// using Backend.Api.Modules.BookingService.Services;
// using Microsoft.AspNetCore.Mvc;

// namespace Backend.Api.Modules.BookingService.Controllers;

// [ApiController]
// [Route("api/[controller]")]
// public class BookingsController : ControllerBase
// {
//     private readonly IBookingService _bookingService;

//     public BookingsController(IBookingService bookingService)
//     {
//         _bookingService = bookingService;
//     }

//     [HttpGet("{id}")]
//     public async Task<ActionResult<BookingDto>> GetBooking(Guid id)
//     {
//         var booking = await _bookingService.GetBookingByIdAsync(id);

//         if (booking == null)
//         {
//             return NotFound();
//         }

//         // Map Booking to BookingDto
//         var bookingDto = new BookingDto
//         {
//             Id = booking.Id,
//             SpaceId = booking.SpaceId,
//             UserId = booking.UserId,
//             StartDate = booking.StartDateTime,
//             EndDate = booking.EndDateTime,
//             NumberOfGuests = booking.NumPeople,
//             GroupMembers = booking.GroupMembers.Select(gm => new GroupMemberDto
//             {
//                 Id = gm.Id,
//                 Name = gm.Name,
//                 Email = gm.Email
//             }).ToList()
//         };

//         return bookingDto;
//     }

//     [HttpGet]
//     public async Task<ActionResult<IEnumerable<BookingDto>>> GetAllBookings()
//     {
//         var bookings = await _bookingService.GetAllBookingsAsync();

//         var bookingDtos = bookings.Select(booking => new BookingDto
//         {
//             Id = booking.Id,
//             SpaceId = booking.SpaceId,
//             UserId = booking.UserId,

//             GroupMembers = booking.GroupMembers.Select(gm => new GroupMemberDto
//             {
//                 Id = gm.Id,
//                 Name = gm.Name,
//                 Email = gm.Email
//             }).ToList()
//         });

//         return Ok(bookingDtos);
//     }

//     [HttpPost]
//     public async Task<ActionResult<BookingDto>> CreateBooking(CreateBookingRequest request)
//     {
//         var booking = new Booking
//         {
//             SpaceId = request.SpaceId,
//             UserId = request.UserId,

//         };

//         var createdBooking = await _bookingService.CreateBookingAsync(booking);

//         if (createdBooking == null)
//         {
//             return BadRequest();
//         }

//         // Map Booking to BookingDto
//         var bookingDto = new BookingDto
//         {
//             Id = createdBooking.Id,
//             SpaceId = createdBooking.SpaceId,
//             UserId = createdBooking.UserId,

//             GroupMembers = createdBooking.GroupMembers.Select(gm => new GroupMemberDto
//             {
//                 Id = gm.Id,
//                 Name = gm.Name,
//                 Email = gm.Email
//             }).ToList()
//         };

//         return CreatedAtAction(nameof(GetBooking), new { id = bookingDto.Id }, bookingDto);
//     }

//     [HttpPut("{id}/cancel")]
//     public async Task<IActionResult> CancelBooking(Guid id)
//     {
//         var result = await _bookingService.CancelBookingAsync(id);

//         if (!result)
//         {
//             return NotFound();
//         }

//         return NoContent();
//     }

//     [HttpPut("{id}/confirm")]
//     public async Task<IActionResult> ConfirmBooking(Guid id)
//     {
//         var result = await _bookingService.ConfirmBookingAsync(id);

//         if (!result)
//         {
//             return NotFound();
//         }

//         return NoContent();
//     }
// }