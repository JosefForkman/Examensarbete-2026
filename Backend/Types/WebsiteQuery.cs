using Backend.Models;
using Backend.Service;

namespace Backend.Types;

[QueryType]
public static class WebsiteQuery
{
    public static Book GetBook()
        => new Book("C# in depth.", new Author("Jon Skeet"));

    [UsePaging]
    [UseProjection]
    [UseFiltering]
    [UseSorting]
    public static IQueryable<WebsiteType> GetWebsites(IGenericService<Website> websiteService)
    {
        return websiteService.GetAll().Select(website => new WebsiteType
        {
            Id = website.Id,
            Name = website.SiteName,
            Url = website.SiteUrl
        });
    }
    
}
