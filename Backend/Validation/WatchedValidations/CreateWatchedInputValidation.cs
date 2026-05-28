using Backend.Types.Watched;
using FluentValidation;

namespace Backend.Validation.WatchedValidations
{
    public class CreateWatchedInputValidation : AbstractValidator<CreateWatchedInput>
    {
        public CreateWatchedInputValidation()
        {
            RuleSet("Create", () =>
            {
                RuleFor(input => input.UserId).NotEmpty().WithMessage("UserId is required.");
                RuleFor(input => input.PostItemId).GreaterThan(0).WithMessage("PostItemId must be greater than 0.");
            });
        }
    }
}
