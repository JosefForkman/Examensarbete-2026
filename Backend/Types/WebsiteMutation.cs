using System;
using Backend.Models;
using Backend.Service;

namespace Backend.Types;

[MutationType]
public class WebsiteMutation
{
    public async Task<CreateWebsitePayload> CreateWebsite(CreateWebsiteInput input, [Service] IGenericService<Website> websiteService)
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