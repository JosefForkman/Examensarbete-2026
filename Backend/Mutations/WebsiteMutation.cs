using Backend.Exception;
using Backend.Models;
using Backend.Service;
using Backend.Types.Website;
using Backend.Validation.WebsiteValidations;
using FluentValidation;
using ValidationException = Backend.Exception.ValidationException;

namespace Backend.Mutations;

[MutationType]
public class WebsiteMutation
{
    //[Error<AggregateException>]
    public async Task<CreateWebsitePayload> CreateWebsite(CreateWebsiteInput input,
        [Service] IGenericService<Website> websiteService)
    {
        IValidator<CreateWebsiteInput> Validator = new CreateWebsiteInputValidation();

        var validationResult =
            await Validator.ValidateAsync(input, options => options.IncludeRuleSets("Create"));

        if (!validationResult.IsValid)
        {
            throw new ValidationException(
                $"Validation failed for CreateWebsiteInput {validationResult.Errors.Select(e => e.ErrorMessage)}");
        }

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

        IValidator<UpdateWebsiteInput> Validator = new UpdateWebsiteInputValidation();

        var validationResult =
            await Validator.ValidateAsync(input, options => options.IncludeRuleSets("Update"));

        if(validationResult != null)
        {
            throw new ValidationException($"Validation failed for UpdateWebsiteInput {validationResult.Errors.Select(e => e.ErrorMessage)}");
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