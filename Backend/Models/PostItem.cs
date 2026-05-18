using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class PostItem
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        [Required]
        public string Link { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime PublicationDate { get; set; }
        public int WebsiteId { get; set; }

        //Navigational properties
        public Website Website { get; set; } = null!;
        public ICollection<Watched> WatchedByUser { get; set; } = new List<Watched>();
    }
}
