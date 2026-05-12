using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Watched
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string UserId { get; set; } = null!;
        [Required]
        public int PostItemId { get; set; }

        // Navigational properties
        public IdentityUser User { get; set; } = null!;
        public PostItem PostItem { get; set; } = null!;
    }
}
