using Backend.Exception;
using Backend.Models;
using Backend.Service;
using Backend.Types.Followed;
using Backend.Validation.FollowedValidations;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using ValidationException = Backend.Exception.ValidationException;

namespace Backend.Mutations
{
    [MutationType]
    public class FollowedMutation
    {
        [Error<NotFoundException>]
        //[Error<AggregateException>]
        public async Task<CreateFollowedPayload> CreateFollowed(CreateFollowedInput input, [Service] GenericService<Followed> followedService,
            [Service] UserService userService, [Service] GenericService<Website> websiteService)
        {
            IValidator<CreateFollowedInput> Validator = new CreateFollowedInputValidation();

            var validationResult =
            await Validator.ValidateAsync(input, options => options.IncludeRuleSets("Create"));

            if (!validationResult.IsValid)
            {
                throw new ValidationException($"Validation failed for CreateFollowedInput {validationResult.Errors.Select(e => e.ErrorMessage)}");
            }

            var existingUser = await userService.GetUserById(input.UserId);

            if (existingUser == null)
            {
                throw new NotFoundException("User", input.UserId);
            }

            var existingWebsite = await websiteService.GetByIdAsync(input.WebsiteId);

            if (existingWebsite == null)
            {
                throw new NotFoundException("Website", input.WebsiteId);
            }

            var followed = new Followed
            {
                UserId = input.UserId,
                WebsiteId = input.WebsiteId
            };

            var createdFollowed = await followedService.CreateAsync(followed);

            return new CreateFollowedPayload
            {
                Id = createdFollowed.Id,
                UserId = createdFollowed.UserId,
                WebsiteId = createdFollowed.WebsiteId
            };
        }

        [Error<NotFoundException>]
        [Error<InvalidOperationException>]
        public async Task<bool> DeleteFollowed(int id, [Service] GenericService<Followed> followedService)
        {
            var followed = await followedService.GetByIdAsync(id);

            if (followed == null)
            {
                throw new NotFoundException("Followed", id);
            }

            await followedService.DeleteAsync(id);
            return true;
        }

        [Error<NotFoundException>]
        //[Error<AggregateException>]
        public async Task<UpdateFollowedPayload> UpdateFollowed(int id, UpdateFollowedInput input, [Service] GenericService<Followed> followedService,
            [Service] UserService userService, [Service] GenericService<Website> websiteService)
        {
            IValidator<UpdateFollowedInput> Validator = new UpdateFollowedInputValidation();

            var validationResult =
            await Validator.ValidateAsync(input, options => options.IncludeRuleSets("Update"));

            if (!validationResult.IsValid)
            {
                throw new ValidationException($"Validation failed for UpdateFollowedInput {validationResult.Errors.Select(e => e.ErrorMessage)}");
            }

            var followed = await followedService.GetByIdAsync(id);

            if (followed == null)
            {
                throw new NotFoundException("Followed", id);
            }

            var existingUser = await userService.GetUserById(input.UserId);

            if (existingUser == null)
            {
                throw new NotFoundException("User", input.UserId);
            }

            var existingWebsite = await websiteService.GetByIdAsync(input.WebsiteId);

            if (existingWebsite == null)
            {
                throw new NotFoundException("Website", input.WebsiteId);
            }

            followed.UserId = input.UserId;
            followed.WebsiteId = input.WebsiteId;

            var updatedFollowed = await followedService.UpdateAsync(followed);

            return new UpdateFollowedPayload
            {
                Id = updatedFollowed.Id,
                UserId = updatedFollowed.UserId,
                WebsiteId = updatedFollowed.WebsiteId
            };
        }
    }
}
