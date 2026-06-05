namespace Backend.Types.Website
{
    public class UpdateWebsiteInput
    {
        public string SiteName { get; set; } = null!;
        public string? Description { get; set; } = null;
        public string RSSUrl { get; set; } = null!;
        public string SiteUrl { get; set; } = null!;
        public string? ImageUrl { get; set; } = null;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}