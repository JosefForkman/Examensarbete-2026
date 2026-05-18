using Backend.Models;
using Backend.Service;
using Backend.Types.Watched;

namespace Backend.Mutations
{
    [MutationType]
    public class WatchedMutation
    {
        public async Task<CreateWatchedPayload> CreateWatched(CreateWatchedInput input, [Service] GenericService<Watched> watchedService)
        {
            var watched = new Watched
            {
                PostItemId = input.PostItemId,
                UserId = input.UserId
            };

            var createdWatched = await watchedService.CreateAsync(watched);

            return new CreateWatchedPayload
            {
                Id = createdWatched.Id,
                PostItemId = createdWatched.PostItemId,
                UserId = createdWatched.UserId
            };
        }
    }
}
