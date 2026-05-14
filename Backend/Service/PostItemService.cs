using Backend.Data;
using Backend.Models;
using Backend.Types;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service
{
    public class PostItemService(RSSDbContext context) : GenericService<PostItem>(context)
    {
        private readonly RSSDbContext context = context;

        public override IQueryable<PostItem> GetAll()
        {
            return context.PostItems
                .Include(postItem => postItem.Website);
        }

        public override Task<PostItem?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
