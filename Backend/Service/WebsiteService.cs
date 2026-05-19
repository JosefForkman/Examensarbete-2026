using Backend.Data;
using Backend.Models;
using FluentValidation;

namespace Backend.Service
{
    public class WebsiteService : GenericService<Website>
    {
        public WebsiteService(RSSDbContext context, IValidator<Website> validator) : base(context, validator)
        {
        }

        public async Task<Website?> GetByUrlAsync(string url)
        {
            return _context.Websites
                .SingleOrDefault(website => website.SiteUrl == url);
        }
    }
}