using Backend.Api.Modules.BookingService.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion; // For EnumToStringConverter


namespace Backend.Api.Data.Configurations
{
    public class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            // Table Name & Schema (Phù hợp với kiến trúc modular monolithic)
            builder.ToTable("Bookings", "BookingService"); // "BookingService" là schema

            // Primary Key
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id).ValueGeneratedOnAdd();

            // Foreign Keys and Relationships
            // Booking (Many) -> User (One)
            builder.HasOne(b => b.User)
                   .WithMany() // Assuming User entity might eventually have an ICollection<Booking> Bookings property.
                               // If User will NEVER have a Bookings collection, you can omit .WithMany()
                               // or be more explicit if User.cs has Bookings: .WithMany(u => u.Bookings)
                   .HasForeignKey(b => b.UserId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Restrict); // Hoặc .Cascade tùy theo logic nghiệp vụ

            // Booking (Many) -> Space (One)
            builder.HasOne(b => b.Space)
                   .WithMany() // Similar to User relationship
                   .HasForeignKey(b => b.SpaceId)
                   .IsRequired()
                   .OnDelete(DeleteBehavior.Restrict);

            // Booking Timeframe (Required by default for non-nullable DateTime)
            builder.Property(b => b.StartDateTime).IsRequired();
            builder.Property(b => b.EndDateTime).IsRequired();

            // Actual Usage Timeframe (Nullable by default)
            builder.Property(b => b.ActualCheckIn).IsRequired(false);
            builder.Property(b => b.ActualCheckOut).IsRequired(false);

            // Soft Delete
            builder.Property(b => b.IsDeleted).HasDefaultValue(false);
            // Consider adding a global query filter for soft deletes in your DbContext or base configuration
            // builder.HasQueryFilter(b => !b.IsDeleted);

            // Booking Details
            builder.Property(b => b.BookingCode)
                   .HasMaxLength(20)
                   .IsRequired(false); // Nullable
            // Unique constraint for BookingCode (if it's not null)
            builder.HasIndex(b => b.BookingCode)
                   .IsUnique()
                   .HasFilter("[BookingCode] IS NOT NULL"); // SQL Server syntax, for SQLite it might be different or implicit
                                                            // For SQLite, if a column is part of a UNIQUE constraint, NULLs are typically treated as distinct.
                                                            // So, .IsUnique() might be enough if multiple NULLs are allowed.
                                                            // If only one NULL is allowed or to be explicit:
                                                            // For SQLite, you might need to create this index manually in migration or use a raw SQL.
                                                            // However, EF Core 7+ has better support. Let's assume .IsUnique() works as expected for now.

            builder.Property(b => b.Note)
                   .HasMaxLength(500)
                   .IsRequired(false);

            builder.Property(b => b.NumPeople).IsRequired(); // Range (1,100) is a validation attribute, not directly a DB constraint by default.
                                                             // You could add a CHECK constraint if needed:
                                                             // builder.ToTable(tb => tb.HasCheckConstraint("CK_Booking_NumPeople", "[NumPeople] >= 1 AND [NumPeople] <= 100"));


            // Enum BookingStatus - Convert to string for better readability in DB
            builder.Property(b => b.BookingStatus)
                   .IsRequired()
                   .HasDefaultValue(BookingStatus.Pending)
                   .HasConversion(new EnumToStringConverter<BookingStatus>());
            // Or .HasConversion<string>();

            // Audit Fields
            builder.Property(b => b.CreatedAt)
                   .IsRequired()
                   .HasDefaultValueSql("CURRENT_TIMESTAMP"); // SQLite compatible for UTC-like timestamp
                                                             // For SQL Server: .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(b => b.UpdatedAt).IsRequired(false);

            // --- Ignored Navigation Properties (for now, as per "minimal" requirement) ---
            // EF Core will ignore these if the corresponding entities (Payment, Review, etc.)
            // are not included in the DbContext or configured.
            // If you had DbSet for them, you might need to explicitly ignore:
            // builder.Ignore(b => b.Payments);
            // builder.Ignore(b => b.Reviews);
            // builder.Ignore(b => b.ExtraCharges);
            // builder.Ignore(b => b.DamageReports);
            // builder.Ignore(b => b.ServiceItems);
        }
    }
}