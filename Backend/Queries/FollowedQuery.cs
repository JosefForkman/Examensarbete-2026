using Backend.Models;
using Backend.Service;
using Backend.Types.Followed;

namespace Backend.Queries
{
    [QueryType]
    public static class FollowedQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<FollowedType> GetFollowedItems([Service] GenericService<Followed> followedService)
        {
            return followedService.GetAll()
                .Select(f => new FollowedType
                {
                    Id = f.Id,
                    UserId = f.UserId,
                    WebsiteId = f.WebsiteId
                });
        }

        public static async Task<FollowedType?> GetFollowedItemById(int id, [Service] GenericService<Followed> followedService)
        {
            var followed = await followedService.GetByIdAsync(id);

            if (followed == null)
            {
                return null;
            }

            return new FollowedType
            {
                Id = followed.Id,
                UserId = followed.UserId,
                WebsiteId = followed.WebsiteId
            };
        }
}
