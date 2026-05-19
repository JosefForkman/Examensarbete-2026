using Backend.Models;
using Backend.Service;
using Backend.Types.PostItem;

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
                throw new System.Exception($"Website with URL '{input.WebsiteUrl}' not found.");
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
        public async Task<bool> DeletePostItem(int id, [Service] PostItemService postItemService)
        {
            var postItem = await postItemService.GetByIdAsync(id);

            if (postItem == null)
            {
                throw new System.Exception($"Post item with ID '{id}' not found.");
            }

            await postItemService.DeleteAsync(id);
            return true;
        }

        public async Task<UpdatePostItemPayload> UpdatePostItem(int id, UpdatePostItemInput input, [Service] PostItemService postItemService, [Service] WebsiteService websiteService)
        {
            var postItem = await postItemService.GetByIdAsync(id);

            if (postItem == null)
            {
                throw new System.Exception($"Post item with ID '{id}' not found.");
            }

            var website = await websiteService.GetByUrlAsync(input.WebsiteUrl);

            if (website == null)
            {
                throw new System.Exception($"Website with URL '{input.WebsiteUrl}' not found.");
            }

            postItem.Title = input.Title;
            postItem.Description = input.Description;
            postItem.Link = input.Link;
            postItem.ImageUrl = input.ImageUrl;
            postItem.PublicationDate = input.PublicationDate;
            postItem.WebsiteId = website.Id;
            var updatedPostItem = await postItemService.UpdateAsync(postItem);

            return new UpdatePostItemPayload
            {
                Id = updatedPostItem.Id,
                Title = updatedPostItem.Title,
                Description = updatedPostItem.Description,
                Link = updatedPostItem.Link,
                ImageUrl = updatedPostItem.ImageUrl,
                PublicationDate = updatedPostItem.PublicationDate,
                WebsiteId = updatedPostItem.WebsiteId
            };
        }
    }
}
