
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class RSSDbContext(DbContextOptions<RSSDbContext> options) : IdentityDbContext<IdentityUser>(options)
    {
        public DbSet<Website> Websites { get; set; } = null!;
        public DbSet<PostItem> PostItems { get; set; } = null!;
        public DbSet<Followed> Followed { get; set; } = null!;
        public DbSet<Watched> Watched { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure relationships and constraints if needed

            modelBuilder.Entity<PostItem>()
            .ToTable(item => item.HasCheckConstraint(
                "CK_PostItems_PublicationDate_NotInFuture",
                "\"PublicationDate\" <= CURRENT_TIMESTAMP"));
        }

    }
}
