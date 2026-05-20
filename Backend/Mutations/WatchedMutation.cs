using Backend.Models;
using Backend.Service;
using Backend.Types.Watched;

namespace Backend.Mutations
{
    [MutationType]
    public class WatchedMutation
    {
        public async Task<CreateWatchedPayload> CreateWatched(CreateWatchedInput input, [Service] GenericService<Watched> watchedService,
            [Service] UserService userService, [Service] PostItemService postItemService)
        {
            var existingUser = await userService.GetUserById(input.UserId);

            if (existingUser == null)
            {
                throw new System.Exception($"User with ID '{input.UserId}' not found.");
            }

            var existingPostItem = await postItemService.GetByIdAsync(input.PostItemId);

            if (existingPostItem == null)
            {
                throw new System.Exception($"Post item with ID '{input.PostItemId}' not found.");
            }

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

        public async Task<UpdateWatchedPayload> UpdateWatched(int id, UpdateWatchedInput input, [Service] GenericService<Watched> watchedService,
            [Service] UserService userService, [Service] GenericService<Website> websiteService)
        {
            var watched = await watchedService.GetByIdAsync(id);

            if (watched == null)
            {
                throw new System.Exception($"Watched item with ID '{id}' not found.");
            }

            var existingUser = await userService.GetUserById(input.UserId);

            if (existingUser == null)
            {
                throw new System.Exception($"User with ID '{input.UserId}' not found.");
            }

            var existingPostItem = await websiteService.GetByIdAsync(input.PostItemId);

            if (existingPostItem == null)
            {
                throw new System.Exception($"Post item with ID '{input.PostItemId}' not found.");
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
