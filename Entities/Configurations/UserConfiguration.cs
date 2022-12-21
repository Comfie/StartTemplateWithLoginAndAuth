using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace mcd_care_web.Entities.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {

            builder.HasKey(e => e.Id);

            builder.Property(e => e.Role)
                .HasConversion<string>();

            builder.Property(e => e.Email)
                .HasMaxLength(255);

            builder.Property(e => e.FirstName)
                .HasMaxLength(255)
                .IsUnicode(false);

            builder.Property(e => e.LastName)
                .HasMaxLength(255);

            builder.Property(e => e.Username)
                .HasMaxLength(255);

    }
}
