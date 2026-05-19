using Backend.Models;
using FluentValidation;

namespace Backend.Validation;

public class WebsiteValidation : AbstractValidator<Website>
{
    public WebsiteValidation()
    {
        RuleSet("Create", () =>
        {
            RuleFor(website => website.SiteName)
                .NotEmpty()
                .WithMessage("Name is required.")
                .MaximumLength(100)
                .WithMessage("Name cannot exceed 100 characters.");

            RuleFor(website => website.SiteUrl)
                .NotEmpty()
                .WithMessage("URL is required.")
                .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                .WithMessage("URL must be a valid absolute URI.");

            RuleFor(website => website.RSSUrl)
                .NotEmpty()
                .WithMessage("RSS URL is required.")
                .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                .WithMessage("RSS URL must be a valid absolute URI.");
        });

        RuleSet("Update", () =>
        {
            RuleFor(website => website.SiteName)
                .MaximumLength(100)
                .When(w => !string.IsNullOrEmpty(w.SiteName));

            RuleFor(website => website.SiteUrl)
                .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                .When(website => !string.IsNullOrEmpty(website.SiteUrl));

            RuleFor(website => website.RSSUrl)
                .Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                .When(website => !string.IsNullOrEmpty(website.RSSUrl));
        });
    }
}