using Backend.Data;
using Backend.Exception;
using Backend.Models;
using Backend.Types;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service
{
    public class PostItemService(RSSDbContext context, IValidator<PostItem> validator)
        : GenericService<PostItem>(context, validator)
    {

        public override IQueryable<PostItem> GetAll()
        {
            return _context.PostItems
                .Include(postItem => postItem.Website);
        }

        public async override Task<PostItem?> GetByIdAsync(int id)
        {
            var postItem = await _context.PostItems
                .Include(postItem => postItem.Website)
                .SingleOrDefaultAsync(postItem => postItem.Id == id);
            
            return postItem;
        }
    }
}