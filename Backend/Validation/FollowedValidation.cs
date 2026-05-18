using Backend.Models;
using FluentValidation;

namespace Backend.Validation;

public class FollowedValidation : AbstractValidator<Followed>
{
    public FollowedValidation()
    {
        RuleSet("Create", () =>
        {
            RuleFor(followed => followed.UserId).NotEmpty();
            RuleFor(followed => followed.WebsiteId).GreaterThan(0);
        });

        RuleSet("Update", () => { });
    }
}

