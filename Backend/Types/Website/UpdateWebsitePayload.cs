namespace Backend.Types.Website
{
    public class UpdateWebsitePayload
    {
        public int Id { get; set; }
        public string SiteName { get; set; } = null!;
        public string SiteUrl { get; set; } = null!;
    }
}
