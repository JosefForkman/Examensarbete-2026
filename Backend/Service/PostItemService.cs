using Backend.Data;
using Backend.Models;
using Backend.Types;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service
{
    public class PostItemService : GenericService<PostItem>
    {
        public PostItemService(RSSDbContext context) : base(context)
        {

        }

        public override IQueryable<PostItem> GetAll()
        {
            return _context.PostItems
                .Include(postItem => postItem.Website);
        }

        public override Task<PostItem?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}
