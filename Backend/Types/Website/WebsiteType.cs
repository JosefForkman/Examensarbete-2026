namespace Backend.Types.Website;

public class WebsiteType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = null;
    public string Url { get; set; } = string.Empty;
    public string RSSUrl { get; set; } = string.Empty;
    public string? ImageUrl { get; set; } = null;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}