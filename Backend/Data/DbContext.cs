using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class DbContext : IdentityDbContext
    {
        public DbContext(DbContextOptions<DbContext> options) : base(options)
        {

        }

        public DbSet<Website> Websites { get; set; } = null!;
        public DbSet<PostItem> PostItems { get; set; } = null!;
        public DbSet<Followed> Followed { get; set; } = null!;
        public DbSet<Watched> Watched { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure relationships and constraints if needed
            modelBuilder.Entity<Followed>()
                .HasOne(followed => followed.User)
                .WithMany()
                .HasForeignKey(followed => followed.UserId);

            modelBuilder.Entity<Followed>()
                .HasOne(followed => followed.Website)
                .WithMany()
                .HasForeignKey(followed => followed.WebsiteId);

            modelBuilder.Entity<Watched>()
                .HasOne(watched => watched.User)
                .WithMany()
                .HasForeignKey(watched => watched.UserId);

            modelBuilder.Entity<Watched>()
                .HasOne(watched => watched.PostItem)
                .WithMany()
                .HasForeignKey(watched => watched.PostItemId);

            modelBuilder.Entity<PostItem>()
            .ToTable(item => item.HasCheckConstraint(
                "CK_PostItems_PublicationDate_NotInFuture",
                "\"PublicationDate\" <= CURRENT_DATE"));
        }

    }
}
