using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Api.Modules.ServiceService.Entities; // Namespace của ServiceEntity

namespace Backend.Api.Modules.ServiceService.Data.Configurations
{
    public class ServiceEntityConfiguration : IEntityTypeConfiguration<ServiceEntity>
    {
        public void Configure(EntityTypeBuilder<ServiceEntity> builder)
        {
            // --- Primary Key ---
            builder.HasKey(s => s.Id);

            // --- Property: Name ---
            builder.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(150); // Phù hợp với StringLength trong DTO

            // --- Property: Description ---
            builder.Property(s => s.Description)
                .HasMaxLength(1000); // Phù hợp với StringLength trong DTO
                                     // .IsRequired(false); // Mặc định là nullable nếu kiểu dữ liệu là nullable (string?)

            // --- Property: BasePrice ---
            // [Column(TypeName = "decimal(18,2)")] đã được xử lý bởi Data Annotation
            // builder.Property(s => s.BasePrice)
            //    .HasColumnType("decimal(18,2)") // Có thể định nghĩa lại ở đây nếu muốn
            //    .IsRequired();

            // --- Property: Unit (Enum) ---
            builder.Property(s => s.Unit)
                .IsRequired()
                .HasConversion<string>() // Lưu enum dưới dạng string trong DB cho dễ đọc
                .HasMaxLength(50);      // Đảm bảo đủ độ dài cho tên enum dài nhất

            // --- Property: IsAvailableAdHoc ---
            builder.Property(s => s.IsAvailableAdHoc)
                .IsRequired()
                .HasDefaultValue(true); // Giá trị mặc định đã được set trong entity

            // --- Property: IsPricedPerBooking ---
            builder.Property(s => s.IsPricedPerBooking)
                .IsRequired()
                .HasDefaultValue(false); // Giá trị mặc định đã được set trong entity

            // --- Property: CreatedAt ---
            builder.Property(s => s.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()"); // Hoặc "CURRENT_TIMESTAMP" cho SQLite/PostgreSQL
                                                     // Giá trị mặc định đã được set trong entity, nhưng đây là cách DB tự quản lý

            // --- Property: UpdatedAt ---
            builder.Property(s => s.UpdatedAt)
                .IsRequired(false); // Nullable

            // --- Relationships ---
            // Mối quan hệ với ServiceSpace (One-to-Many: ServiceEntity -> ServiceSpace)
            // ServiceEntity là Principal, ServiceSpace là Dependent
            // Khóa ngoại (ServiceId) đã được định nghĩa trong ServiceSpace entity và ServiceSpaceConfiguration
            builder.HasMany(s => s.ServiceSpaces)
                   .WithOne(ss => ss.Service) // Navigation property trong ServiceSpace trỏ về ServiceEntity
                   .HasForeignKey(ss => ss.ServiceId) // Khóa ngoại trong ServiceSpace
                   .OnDelete(DeleteBehavior.Cascade);
            // Hoặc SetNull, Restrict tùy theo logic nghiệp vụ
            // Cascade: Khi xóa ServiceEntity, các ServiceSpace liên quan cũng bị xóa.
            // Cẩn thận với Cascade Delete, đảm bảo đó là hành vi mong muốn.
            // Nếu không muốn cascade delete, có thể để Restrict (mặc định cho non-nullable FK)
            // hoặc SetNull (nếu ServiceId trong ServiceSpace là nullable và bạn muốn giữ lại bản ghi ServiceSpace).

            // --- Indexes (Tùy chọn, nhưng nên có cho các trường hay được query) ---
            builder.HasIndex(s => s.Name).IsUnique(); // Nếu tên Service phải là duy nhất

            // --- Table Name (Tùy chọn, nếu muốn khác với tên DbSet hoặc tên class) ---
            // builder.ToTable("Services");
        }
    }
}