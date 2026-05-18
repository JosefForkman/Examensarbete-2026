using Backend.Models;
using Backend.Service;
using Backend.Types;

namespace Backend.Queries
{
    [QueryType]
    public static class FollowedQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public  static IQueryable<FollowedType> GetFollowedItems([Service] GenericService<Followed> followedService)
        {
            return followedService.GetAll()
                .Select(f => new FollowedType
                {
                    Id = f.Id,
                    UserId = f.UserId,
                    WebsiteId = f.WebsiteId
                });
        }
    }
}
