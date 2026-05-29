using Backend.Exception;
using Backend.Models;
using Backend.Service;
using Backend.Types.Watched;
using Backend.Validation.WatchedValidations;
using FluentValidation;
using ValidationException = Backend.Exception.ValidationException;

namespace Backend.Mutations
{
    [MutationType]
    public class WatchedMutation
    {
        [Error<NotFoundException>]
        //[Error<AggregateException>]
        public async Task<CreateWatchedPayload> CreateWatched(CreateWatchedInput input, [Service] GenericService<Watched> watchedService,
            [Service] UserService userService, [Service] PostItemService postItemService)
        {
            IValidator<CreateWatchedInput> validator = new CreateWatchedInputValidation();

            var validationResult = await validator.ValidateAsync(input, options => options.IncludeRuleSets("Create"));

            if(validationResult != null)
            {
                throw new ValidationException($"Validation failed for CreateWatchedInput {validationResult.Errors.Select(e => e.ErrorMessage)}");
            }

            var existingUser = await userService.GetUserById(input.UserId);

            if (existingUser == null)
            {
                throw new NotFoundException("User", input.UserId);
            }

            var existingPostItem = await postItemService.GetByIdAsync(input.PostItemId);

            if (existingPostItem == null)
            {
                throw new NotFoundException("PostItem", input.PostItemId);
            }

            var watched = new Watched
            {
                PostItemId = input.PostItemId,
                UserId = input.UserId
            };

            var createdWatched = await watchedService.CreateAsync(watched);

            return new CreateWatchedPayload
            {
                Id = createdWatched.Id,
                PostItemId = createdWatched.PostItemId,
                UserId = createdWatched.UserId
            };
        }

        [Error<NotFoundException>]
        [Error<InvalidOperationException>]
        public async Task<bool> DeleteWatched(int id, [Service] GenericService<Watched> watchedService)
        {
            var watched = await watchedService.GetByIdAsync(id);

            if (watched == null)
            {
                throw new NotFoundException("Watched", id);
            }

            await watchedService.DeleteAsync(id);
            return true;
        }

        [Error<NotFoundException>]
        //[Error<AggregateException>]
        public async Task<UpdateWatchedPayload> UpdateWatched(int id, UpdateWatchedInput input, [Service] GenericService<Watched> watchedService,
            [Service] UserService userService, [Service] GenericService<Website> websiteService)
        {
            IValidator<UpdateWatchedInput> validator = new UpdateWatchedInputValidation();

            var validationResult = await validator.ValidateAsync(input, options => options.IncludeRuleSets("Update"));

            if (validationResult != null)
            {
                throw new ValidationException($"Validation failed for UpdateWatchedInput {validationResult.Errors.Select(e => e.ErrorMessage)}");
            }

            var watched = await watchedService.GetByIdAsync(id);

            if (watched == null)
            {
                throw new NotFoundException("Watched", id);
            }

            var existingUser = await userService.GetUserById(input.UserId);

            if (existingUser == null)
            {
                throw new NotFoundException("User", input.UserId);
            }

            var existingPostItem = await websiteService.GetByIdAsync(input.PostItemId);

            if (existingPostItem == null)
            {
                throw new NotFoundException("PostItem", input.PostItemId);
            }

            watched.PostItemId = input.PostItemId;
            watched.UserId = input.UserId;

            var updatedWatched = await watchedService.UpdateAsync(watched);

            return new UpdateWatchedPayload
            {
                Id = updatedWatched.Id,
                PostItemId = updatedWatched.PostItemId,
                UserId = updatedWatched.UserId
            };
        }
    }
}
