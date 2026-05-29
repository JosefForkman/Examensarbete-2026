using Backend.Types.Followed;
using FluentValidation;

namespace Backend.Validation.FollowedValidations
{
    public class CreateFollowedInputValidation : AbstractValidator<CreateFollowedInput>
    {
        public CreateFollowedInputValidation()
        {
            RuleSet("Create", () =>
            {
                RuleFor(input => input.UserId).NotEmpty().WithMessage("UserId is required.");
                RuleFor(input => input.WebsiteId).GreaterThan(0).WithMessage("WebsiteId must be greater than 0.");
            });
        }
    }
}
