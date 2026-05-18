namespace Backend.Types
{
    public class FollowedType
    {
        public int Id { get; set; }
        public int WebsiteId { get; set; }
        public string UserId { get; set; } = null!;
    }
}
