using Backend.Api.Modules.BookingService.Entities;
using System;
using System.Collections.Generic;

namespace Backend.Api.Modules.BookingService.Models;

public class BookingDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid SpaceId { get; set; }
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public int NumPeople { get; set; }
    public int? GroupSize { get; set; }
    public Guid? GroupLeaderId { get; set; }
    public int? CleaningDurationMinutes { get; set; }
    public int? BufferHours { get; set; }
    public DateTime? ActualCheckIn { get; set; }
    public DateTime? ActualCheckOut { get; set; }
    public BookingStatus BookingStatus { get; set; }
}