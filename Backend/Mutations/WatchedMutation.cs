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

        public async Task<bool> DeleteWatched(int id, [Service] GenericService<Watched> watchedService)
        {
            var watched = await watchedService.GetByIdAsync(id);

            if (watched == null)
            {
                throw new System.Exception($"Watched item with ID '{id}' not found.");
            }

            await watchedService.DeleteAsync(id);
            return true;
        }

        public async Task<UpdateWatchedPayload> UpdateWatched(int id, UpdateWatchedInput input, [Service] GenericService<Watched> watchedService)
        {
            var watched = await watchedService.GetByIdAsync(id);

            if (watched == null)
            {
                throw new System.Exception($"Watched item with ID '{id}' not found.");
            }

            watched.PostItemId = input.PostItemId;
            watched.UserId = input.UserId;

            var updatedWatched = await watchedService.UpdateAsync(watched);

            return new UpdateWatchedPayload
            {
                Id = updatedWatched.Id,
                PostItemId = updatedWatched.PostItemId,
                UserId = updatedWatched.UserId
            };
        }
    }
}
