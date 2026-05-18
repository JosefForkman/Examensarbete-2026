namespace Backend.Types.Website
{
    public class UpdateWebsiteInput
    {
        public string SiteName { get; set; } = null!;
        public string RSSUrl { get; set; } = null!;
        public string SiteUrl { get; set; } = null!;
    }
}
