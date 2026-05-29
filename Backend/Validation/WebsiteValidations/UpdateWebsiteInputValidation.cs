using Backend.Types.Website;
using FluentValidation;

namespace Backend.Validation.WebsiteValidations
{
    public class UpdateWebsiteInputValidation : AbstractValidator<UpdateWebsiteInput>
    {
        public UpdateWebsiteInputValidation()
        {
            RuleSet("Update", () =>
            {
                RuleFor(input => input.SiteName).NotEmpty().WithMessage("SiteName is required.");
                RuleFor(input => input.RSSUrl).NotEmpty().WithMessage("RSSUrl is required.")
                    .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute)).WithMessage("RSSUrl must be a valid URL.");
                RuleFor(input => input.SiteUrl).NotEmpty().WithMessage("SiteUrl is required.")
                    .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute)).WithMessage("SiteUrl must be a valid URL.");
            });
        }
    }
}
