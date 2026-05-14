using Backend.Models;
using Backend.Service;
using Backend.Types;

namespace Backend.Mutations
{
    [MutationType]
    public class PostItemMutation
    {
        public async Task<CreatePostItemPayload> CreatePostItem(CreatePostItemInput input, [Service] PostItemService postItemService, [Service] WebsiteService websiteService)
        {
            var website = await websiteService.GetByUrlAsync(input.WebsiteUrl);

            if (website == null)
            {
                throw new Exception($"Website with URL '{input.WebsiteUrl}' not found.");
            }

            // Add validation to Check if a post item with same title and publication date already exists for the website

            var postItem = new PostItem
            {
                Title = input.Title,
                Description = input.Description,
                Link = input.Link,
                ImageUrl = input.ImageUrl,
                PublicationDate = input.PublicationDate,
                WebsiteId = website.Id
            };

            var createdPostItem = await postItemService.CreateAsync(postItem);

            return new CreatePostItemPayload
            {
                Id = createdPostItem.Id,
                Title = createdPostItem.Title,
                Description = createdPostItem.Description,
                Link = createdPostItem.Link,
                ImageUrl = createdPostItem.ImageUrl,
                PublicationDate = createdPostItem.PublicationDate,
                WebsiteId = createdPostItem.WebsiteId
            };
        }
    }
}
