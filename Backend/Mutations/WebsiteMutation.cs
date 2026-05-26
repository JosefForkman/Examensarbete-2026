using Backend.Exception;
using Backend.Models;
using Backend.Service;
using Backend.Types.Website;

namespace Backend.Mutations;

[MutationType]
public class WebsiteMutation
{
    //[Error<AggregateException>]
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

    [Error<NotFoundException>]
    [Error<InvalidOperationException>]
    public async Task<bool> DeleteWebsite(int id, [Service] IGenericService<Website> websiteService)
    {
        var website = await websiteService.GetByIdAsync(id);

        if (website == null)
        {
            throw new NotFoundException("Website", id);
        }

        await websiteService.DeleteAsync(id);
        return true;
    }

    [Error<NotFoundException>]
    //[Error<AggregateException>]
    public async Task<UpdateWebsitePayload> UpdateWebsite(int id, UpdateWebsiteInput input, [Service] IGenericService<Website> websiteService)
    {
        var website = await websiteService.GetByIdAsync(id);

        if (website == null)
        {
            throw new NotFoundException("Website", id);
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