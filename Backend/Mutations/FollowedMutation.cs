using Backend.Models;
using Backend.Service;
using Backend.Types.Followed;

namespace Backend.Mutations
{
    [MutationType]
    public class FollowedMutation
    {
        public async Task<CreateFollowedPayload> CreateFollowed(CreateFollowedInput input, [Service] GenericService<Followed> followedService)
        {
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
    }
}
