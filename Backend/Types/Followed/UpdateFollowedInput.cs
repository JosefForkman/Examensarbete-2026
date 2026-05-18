namespace Backend.Types.Followed
{
    public class UpdateFollowedInput
    {
        public string UserId { get; set; } = null!;
        public int WebsiteId { get; set; }
    }
}
