using Backend.Data;
using Backend.Models;
using Backend.Types;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service
{
    public class PostItemService(RSSDbContext context, IValidator<PostItem> validator)
        : GenericService<PostItem>(context, validator)
    {
        private readonly RSSDbContext _context = context;

        public override IQueryable<PostItem> GetAll()
        {
            return _context.PostItems
                .Include(postItem => postItem.Website);
        }

        public override Task<PostItem> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
