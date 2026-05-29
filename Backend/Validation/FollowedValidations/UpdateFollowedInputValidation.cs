using Backend.Types.Followed;
using FluentValidation;

namespace Backend.Validation.FollowedValidations
{
    public class UpdateFollowedInputValidation : AbstractValidator<UpdateFollowedInput>
    {
        public UpdateFollowedInputValidation()
        {
            RuleSet("Update", () =>
            {
                RuleFor(input => input.UserId).NotEmpty().WithMessage("UserId is required.");
                RuleFor(input => input.WebsiteId).GreaterThan(0).WithMessage("WebsiteId must be greater than 0.");
            });
        }
    }
}
