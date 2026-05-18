using Backend.Exception;
using Backend.Models;
using Backend.Service;
using Backend.Types;

namespace Backend.Mutations;

[MutationType]
public class WebsiteMutation
{
    [Error<ValidationException>]
    public async Task<CreateWebsitePayload> CreateWebsite(CreateWebsiteInput input,
        [Service] IGenericService<Website> websiteService)
    {
        var website = new Website
        {
            SiteName = input.SiteName,
            RSSUrl = input.RSSUrl,
            SiteUrl = input.SiteUrl
        };

        var createdWebsite = await websiteService.CreateAsync(website);

        return new CreateWebsitePayload
        {
            Id = createdWebsite.Id,
            Name = createdWebsite.SiteName,
            Url = createdWebsite.SiteUrl
        };
    }
}