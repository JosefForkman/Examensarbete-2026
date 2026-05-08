using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Website
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string SiteName { get; set; } = string.Empty;
        [Required]
        [Url]
        public string RSSUrl { get; set; } = string.Empty;
        [Required]
        [Url]
        public string SiteUrl { get; set; } = string.Empty;
    }
}
