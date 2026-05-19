using Backend.Exception;
using Backend.Models;
using Backend.Service;
using Backend.Types.Website;

namespace Backend.Queries;

[QueryType]
public static class WebsiteQuery
{
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
    
    [Error<NotFoundException>]
    public static async Task<WebsiteType?> GetWebsiteById(int id, IGenericService<Website> websiteService)
    {
        var website = await websiteService.GetByIdAsync(id);
        if (website == null)
        {
            return null;
        }

        return new WebsiteType
        {
            Id = website.Id,
            Name = website.SiteName,
            Url = website.SiteUrl
        };
    }
}
