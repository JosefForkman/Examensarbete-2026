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

        public static async Task<WatchedType?> GetWatchedItemById(int id, [Service] GenericService<Watched> watchedService)
        {
            var watched = await watchedService.GetByIdAsync(id);

            if (watched == null)
            {
                return null;
            }

            return new WatchedType
            {
                Id = watched.Id,
                PostItemId = watched.PostItemId,
                UserId = watched.UserId
            };
        }
    }
}
