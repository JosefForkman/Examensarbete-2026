using Backend.Exception;
using Backend.Models;
using Backend.Service;
using Backend.Types.Watched;

namespace Backend.Mutations
{
    [MutationType]
    public class WatchedMutation
    {
        [Error<NotFoundException>]
        public async Task<CreateWatchedPayload> CreateWatched(CreateWatchedInput input, [Service] GenericService<Watched> watchedService,
            [Service] UserService userService, [Service] PostItemService postItemService)
        {
            var existingUser = await userService.GetUserById(input.UserId);

            if (existingUser == null)
            {
                throw new NotFoundException("User", input.UserId);
            }

            var existingPostItem = await postItemService.GetByIdAsync(input.PostItemId);

            if (existingPostItem == null)
            {
                throw new NotFoundException("PostItem", input.PostItemId);
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

        [Error<NotFoundException>]
        public async Task<bool> DeleteWatched(int id, [Service] GenericService<Watched> watchedService)
        {
            var watched = await watchedService.GetByIdAsync(id);

            if (watched == null)
            {
                throw new NotFoundException("Watched", id);
            }

            await watchedService.DeleteAsync(id);
            return true;
        }

        [Error<NotFoundException>]
        public async Task<UpdateWatchedPayload> UpdateWatched(int id, UpdateWatchedInput input, [Service] GenericService<Watched> watchedService,
            [Service] UserService userService, [Service] GenericService<Website> websiteService)
        {
            var watched = await watchedService.GetByIdAsync(id);

            if (watched == null)
            {
                throw new NotFoundException("Watched", id);
            }

            var existingUser = await userService.GetUserById(input.UserId);

            if (existingUser == null)
            {
                throw new NotFoundException("User", input.UserId);
            }

            var existingPostItem = await websiteService.GetByIdAsync(input.PostItemId);

            if (existingPostItem == null)
            {
                throw new NotFoundException("PostItem", input.PostItemId);
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
