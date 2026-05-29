using Backend.Models;
using FluentValidation;

namespace Backend.Validation.PostItemValidations;

public class PostItemValidation : AbstractValidator<PostItem>
{
    public PostItemValidation()
    {
        RuleSet("Create", () =>
        {
            RuleFor(item => item.Title).NotEmpty().MaximumLength(200);
            RuleFor(item => item.Link).NotEmpty().Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute));
            RuleFor(item => item.WebsiteId).GreaterThan(0);
            RuleFor(item => item.ImageUrl)
                .Must(uri => string.IsNullOrWhiteSpace(uri) || Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                .WithMessage("ImageUrl must be a valid absolute URL.");
        });

        RuleSet("Update", () =>
        {
            RuleFor(item => item.Title).MaximumLength(200).When(i => !string.IsNullOrEmpty(i.Title));
            RuleFor(item => item.Link).Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                .When(i => !string.IsNullOrEmpty(i.Link));
            RuleFor(item => item.WebsiteId).GreaterThan(0);
            RuleFor(item => item.ImageUrl)
                .Must(uri => string.IsNullOrWhiteSpace(uri) || Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                .WithMessage("ImageUrl must be a valid absolute URL.");
        });
    }
}