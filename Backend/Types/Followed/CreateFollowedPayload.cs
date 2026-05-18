namespace Backend.Types.Followed
{
    public class CreateFollowedPayload
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public int WebsiteId { get; set; }
    }
}
