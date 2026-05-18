namespace Backend.Types.Followed
{
    public class CreateFollowedInput
    {
        public string UserId { get; set; } = null!;
        public int WebsiteId { get; set; }
    }
}
