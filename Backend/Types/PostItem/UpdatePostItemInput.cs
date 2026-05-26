namespace Backend.Types.PostItem
{
    public class UpdatePostItemInput
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string Link { get; set; } = null!;
        public string? ImageUrl { get; set; }
        public string PostId { get; set; } = null!;
        public DateTime PublicationDate { get; set; }
        public string WebsiteUrl { get; set; } = null!;
    }
}
