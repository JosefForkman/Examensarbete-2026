using Backend.Types.PostItem;
using FluentValidation;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Validation.PostItemValidations
{
    public class CreatePostItemInputValidation : AbstractValidator<CreatePostItemInput>
    {
        public CreatePostItemInputValidation() 
        {
            RuleSet("Create", () =>
            {
                RuleFor(item => item.Title).NotEmpty().MaximumLength(200);
                RuleFor(item => item.Link).NotEmpty().Must(uri => Uri.IsWellFormedUriString(uri, UriKind.Absolute));
                RuleFor(item => item.WebsiteUrl)
                    .Must(uri => string.IsNullOrWhiteSpace(uri) || Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                    .WithMessage("ImageUrl must be a valid absolute URL.");
                RuleFor(item => item.PostId)
                    .NotNull()
                    .WithMessage("PostId cannot be null.");
                RuleFor(item => item.ImageUrl)
                    .Must(uri => string.IsNullOrWhiteSpace(uri) || Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                    .WithMessage("ImageUrl must be a valid absolute URL.");
                RuleFor(item => item.PublicationDate)
                    .LessThanOrEqualTo(item => DateTime.UtcNow)
                    .WithMessage("Publication date cannot be in the future.");
            });
        }
    }
}
