using System;
using Backend.Models;
using Backend.Service;
using Backend.Types.Website;

namespace Backend.Mutations;

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

    public async Task<bool> DeleteWebsite(int id, [Service] IGenericService<Website> websiteService)
    {
        var website = await websiteService.GetByIdAsync(id);

        if (website == null)
        {
            throw new Exception($"Website with ID '{id}' not found.");
        }

        await websiteService.DeleteAsync(id);
        return true;
    }
}