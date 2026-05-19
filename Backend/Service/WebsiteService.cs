using Backend.Data;
using Backend.Models;

namespace Backend.Service
{
    public class WebsiteService : GenericService<Website>
    {
        public WebsiteService(RSSDbContext context) : base(context)
        {

        }

        public async Task<Website?> GetByUrlAsync(string url)
        {
            return _context.Websites
                .SingleOrDefault(website => website.SiteUrl == url);
        }
    }
}
