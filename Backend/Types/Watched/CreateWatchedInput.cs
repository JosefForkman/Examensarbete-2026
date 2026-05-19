namespace Backend.Types.Watched
{
    public class CreateWatchedInput
    {
        public string UserId { get; set; } = null!;
        public int PostItemId { get; set; }
    }
}
