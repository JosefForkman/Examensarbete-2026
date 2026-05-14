using Backend.Data;
using Backend.Models;
using Backend.Service;
using Backend.Types;
using Microsoft.EntityFrameworkCore;

namespace Backend.Queries;

[QueryType]
public static class PostItemQuery
{
    public static IQueryable<PostItemType> GetPostItems([Service] PostItemService postItemService)
    {
        return postItemService.GetAll()
            .Select(p => new PostItemType
            {
                Title = p.Title,
                Description = p.Description,
                Link = p.Link,
                ImageUrl = p.ImageUrl,
                PublicationDate = p.PublicationDate,
                WebsiteName = p.Website.SiteName
            });
    }
}