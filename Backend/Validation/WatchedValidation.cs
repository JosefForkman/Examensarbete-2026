using Backend.Models;
using FluentValidation;

namespace Backend.Validation;

public class WatchedValidation : AbstractValidator<Watched>
{
    public WatchedValidation()
    {
        RuleSet("Create", () =>
        {
            RuleFor(watched => watched.UserId).NotEmpty();
            RuleFor(watched => watched.PostItemId).GreaterThan(0);
        });

        RuleSet("Update", () =>
        {
            RuleFor(watched => watched.UserId).NotEmpty();
            RuleFor(watched => watched.PostItemId).GreaterThan(0);
        });
    }
}