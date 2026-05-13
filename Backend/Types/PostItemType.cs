namespace Backend.Types
{
    public class PostItemType
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Link { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public DateTime PublicationDate { get; set; }
        public int WebsiteName { get; set; }
    }
}
