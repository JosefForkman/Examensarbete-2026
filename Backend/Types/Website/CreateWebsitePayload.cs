using System;

namespace Backend.Types.Website;

public class CreateWebsitePayload
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = null;
    public string Url { get; set; } = string.Empty;
    public string? ImageUrl { get; set; } = null;
    public DateTime lastPublicationDate { get; set; } = DateTime.UtcNow;
}