namespace Backend.Types.Website;

public class CreateWebsiteInput
{
    public string SiteName { get; set; } = string.Empty;
    public string? Description { get; set; } = null;
    public string RSSUrl { get; set; } = string.Empty;
    public string SiteUrl { get; set; } = string.Empty;
    public string? ImageUrl { get; set; } = null;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}