namespace Backend.Types.Followed
{
    public class UpdateFollowedPayload
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public int WebsiteId { get; set; }
    }
}
