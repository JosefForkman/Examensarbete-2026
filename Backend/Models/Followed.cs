using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Followed
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string UserId { get; set; } = null!;
        [Required]
        public int WebsiteId { get; set; }

        // Navigational properties
        public IdentityUser User { get; set; } = null!;
        public Website Website { get; set; } = null!;
    }
}
