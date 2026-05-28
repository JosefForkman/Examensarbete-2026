using Backend.Types.Watched;
using FluentValidation;

namespace Backend.Validation.WatchedValidations
{
    public class UpdateWatchedInputValidation : AbstractValidator<UpdateWatchedInput>
    {
        public UpdateWatchedInputValidation()
        {
            RuleSet("Update", () =>
            {
                RuleFor(input => input.UserId).NotEmpty().WithMessage("UserId is required.");
                RuleFor(input => input.PostItemId).GreaterThan(0).WithMessage("PostItemId must be greater than 0.");
            });
        }
    }
}
