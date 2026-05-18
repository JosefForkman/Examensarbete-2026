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

    public async Task<UpdateWebsitePayload> UpdateWebsite(int id, UpdateWebsiteInput input, [Service] IGenericService<Website> websiteService)
    {
        var website = await websiteService.GetByIdAsync(id);

        if (website == null)
        {
            throw new Exception($"Website with ID '{id}' not found.");
        }

        website.SiteName = input.SiteName;
        website.RSSUrl = input.RSSUrl;
        website.SiteUrl = input.SiteUrl;

        var updatedWebsite = await websiteService.UpdateAsync(website);

        return new UpdateWebsitePayload
        {
            Id = updatedWebsite.Id,
            SiteName = updatedWebsite.SiteName,
            SiteUrl = updatedWebsite.SiteUrl
        };
    }
}