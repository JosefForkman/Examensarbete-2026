namespace Backend.Types
{
    public class UpdatePostItemInput
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Link { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public DateTime PublicationDate { get; set; }
        public string WebsiteUrl { get; set; } = null!;
    }
}
