using System;

namespace Backend.Types;

public class CreateWebsitePayload
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}
