// Backend.Api/Data/Configurations/CommunityPolicyConfiguration.cs

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Backend.Api.Modules.CommunityService.Entities; // Namespace của Entity CommunityPolicy và Community

namespace Backend.Api.Data.Configurations // Namespace của các file cấu hình
{
    public class CommunityPolicyConfiguration : IEntityTypeConfiguration<CommunityPolicy>
    {
        public void Configure(EntityTypeBuilder<CommunityPolicy> builder)
        {
            // Configure Primary Key
            builder.HasKey(cp => cp.Id);

            // Configure Composite Unique Index on CommunityId and Version
            // Đảm bảo mỗi Community chỉ có một phiên bản nội quy với cùng một số Version
            builder.HasIndex(cp => new { cp.CommunityId, cp.Version })
                   .IsUnique();

            // Configure Many-to-One relationship to Community
            builder.HasOne(cp => cp.Community) // Mỗi Policy thuộc về MỘT Community
                   .WithMany(c => c.Policies) // Community đó có NHIỀU Policies (cần thêm ICollection<CommunityPolicy>? Policies vào Community)
                   .HasForeignKey(cp => cp.CommunityId) // FK CommunityId nằm trong CommunityPolicy
                   .IsRequired() // Relationship is required
                   .OnDelete(DeleteBehavior.Cascade); // Delete Policies if Community is deleted

        }
    }
}