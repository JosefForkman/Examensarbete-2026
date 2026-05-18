using Backend.Models;
using Backend.Service;
using Backend.Types;

namespace Backend.Queries
{
    [QueryType]
    public static class WatchedQuery
    {
        public static IQueryable<WatchedType> GetWatchedItems([Service] GenericService<Watched> watchedService)
        {
            return watchedService.GetAll()
                .Select(w => new WatchedType
                {
                    Id = w.Id,
                    PostItemId = w.PostItemId,
                    UserId = w.UserId
                });
        }
    }
}
