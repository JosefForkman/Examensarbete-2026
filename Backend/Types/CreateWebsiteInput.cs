namespace Backend.Types;

public class CreateWebsiteInput
{
    public string SiteName { get; set; } = string.Empty;
    public string RSSUrl { get; set; } = string.Empty;
    public string SiteUrl { get; set; } = string.Empty;
}
