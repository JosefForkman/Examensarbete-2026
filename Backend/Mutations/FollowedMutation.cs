using Backend.Models;
using Backend.Service;
using Backend.Types.Followed;
using Microsoft.AspNetCore.Identity;

namespace Backend.Mutations
{
    [MutationType]
    public class FollowedMutation
    {
        public async Task<CreateFollowedPayload> CreateFollowed(CreateFollowedInput input, [Service] GenericService<Followed> followedService,
            [Service] UserService userService, [Service] GenericService<Website> websiteService)
        {
            var existingUser = await userService.GetUserById(input.UserId);

            if (existingUser == null)
            {
                throw new System.Exception($"User with ID '{input.UserId}' not found.");
            }

            var existingWebsite = await websiteService.GetByIdAsync(input.WebsiteId);

            if (existingWebsite == null)
            {
                throw new System.Exception($"Website with ID '{input.WebsiteId}' not found.");
            }

            var followed = new Followed
            {
                UserId = input.UserId,
                WebsiteId = input.WebsiteId
            };

            var createdFollowed = await followedService.CreateAsync(followed);

            return new CreateFollowedPayload
            {
                Id = createdFollowed.Id,
                UserId = createdFollowed.UserId,
                WebsiteId = createdFollowed.WebsiteId
            };
        }

        public async Task<bool> DeleteFollowed(int id, [Service] GenericService<Followed> followedService)
        {
            var followed = await followedService.GetByIdAsync(id);

            if (followed == null)
            {
                throw new System.Exception($"Followed item with ID '{id}' not found.");
            }

            await followedService.DeleteAsync(id);
            return true;
        }

        public async Task<UpdateFollowedPayload> UpdateFollowed(int id, UpdateFollowedInput input, [Service] GenericService<Followed> followedService,
            [Service] UserService userService, [Service] GenericService<Website> websiteService)
        {
            var followed = await followedService.GetByIdAsync(id);

            if (followed == null)
            {
                throw new System.Exception($"Followed item with ID '{id}' not found.");
            }

            var existingUser = await userService.GetUserById(input.UserId);

            if (existingUser == null)
            {
                throw new System.Exception($"User with ID '{input.UserId}' not found.");
            }

            var existingWebsite = await websiteService.GetByIdAsync(input.WebsiteId);

            if (existingWebsite == null)
            {
                throw new System.Exception($"Website with ID '{input.WebsiteId}' not found.");
            }

            followed.UserId = input.UserId;
            followed.WebsiteId = input.WebsiteId;

            var updatedFollowed = await followedService.UpdateAsync(followed);

            return new UpdateFollowedPayload
            {
                Id = updatedFollowed.Id,
                UserId = updatedFollowed.UserId,
                WebsiteId = updatedFollowed.WebsiteId
            };
        }
    }
}
