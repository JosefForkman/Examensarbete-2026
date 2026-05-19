namespace Backend.Types.Watched
{
    public class UpdateWatchedPayload
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public int PostItemId { get; set; }
    }
}
