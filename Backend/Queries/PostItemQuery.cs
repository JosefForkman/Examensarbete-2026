using Backend.Data;
using Backend.Models;
using Backend.Service;
using Backend.Types.PostItem;
using Microsoft.EntityFrameworkCore;

namespace Backend.Queries
{
    [QueryType]
    public static class PostItemQuery
    {
        [UsePaging]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public static IQueryable<PostItemType> GetPostItems([Service] PostItemService postItemService)
        {
            return postItemService.GetAll()
                .Select(p => new PostItemType
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Link = p.Link,
                    ImageUrl = p.ImageUrl,
                    PublicationDate = p.PublicationDate,
                    WebsiteName = p.Website.SiteName
                });
        }

        public static async Task<PostItemType?> GetPostItemById(int id, [Service] PostItemService postItemService)
        {
            var postItem = await postItemService.GetByIdAsync(id);
            if (postItem == null)
            {
                return null;
            }
            return new PostItemType
            {
                Id = postItem.Id,
                Title = postItem.Title,
                Description = postItem.Description,
                Link = postItem.Link,
                ImageUrl = postItem.ImageUrl,
                PublicationDate = postItem.PublicationDate,
                WebsiteName = postItem.Website.SiteName
            };
        }
    }
}
