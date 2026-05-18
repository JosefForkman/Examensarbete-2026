namespace Backend.Types.Watched
{
    public class CreateWatchedPayload
    {
        public int Id { get; set; }
        public int PostItemId { get; set; }
        public string UserId { get; set; } = null!;
    }
}
