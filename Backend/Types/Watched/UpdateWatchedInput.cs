namespace Backend.Types.Watched
{
    public class UpdateWatchedInput
    {
        public int PostItemId { get; set; }
        public string UserId { get; set; } = null!;
    }
}
