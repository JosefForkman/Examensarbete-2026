using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Website
    {
        [Key] public int Id { get; set; }
        [Required] public string SiteName { get; set; } = string.Empty;
        public string? Description { get; set; } = null;
        [Required] [Url] public string RSSUrl { get; set; } = string.Empty;
        [Required] [Url] public string SiteUrl { get; set; } = string.Empty;
        [Url] public string? ImageUrl { get; set; } = null;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        //Navigational properties
        public ICollection<PostItem> PostItems { get; set; } = new List<PostItem>();
        public ICollection<Followed> FollowedByUser { get; set; } = new List<Followed>();
    }
}