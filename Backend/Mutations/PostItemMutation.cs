using Backend.Exception;
using Backend.Models;
using Backend.Service;
using Backend.Types.PostItem;

namespace Backend.Mutations
{
    [MutationType]
    public class PostItemMutation
    {
        //[Error<System.Exception>]
        [Error<NotFoundException>]
        //[Error<AggregateException>]
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
                PostId = input.PostId,
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

        [Error<NotFoundException>]
        [Error<InvalidOperationException>]
        public async Task<bool> DeletePostItem(int id, [Service] PostItemService postItemService)
        {
            var postItem = await postItemService.GetByIdAsync(id);

            if (postItem == null)
            {
                throw new NotFoundException("PostItem", id);
            }

            await postItemService.DeleteAsync(id);
            return true;
        }

        //[Error<System.Exception>]
        [Error<NotFoundException>]
        //[Error<AggregateException>]
        public async Task<UpdatePostItemPayload> UpdatePostItem(int id, UpdatePostItemInput input, [Service] PostItemService postItemService, [Service] WebsiteService websiteService)
        {
            var postItem = await postItemService.GetByIdAsync(id);

            if (postItem == null)
            {
                throw new NotFoundException("PostItem", id);
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
            postItem.PostId = input.PostId;
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
