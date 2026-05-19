using Backend.Data;
using Backend.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Backend.Service
{
    public class WebsiteService : GenericService<Website>
    {
        public WebsiteService(RSSDbContext context, IValidator<Website> validator) : base(context, validator)
        {
        }

        public async Task<Website?> GetByUrlAsync(string url)
        {
            return await _context.Websites
                .SingleOrDefaultAsync(website => website.SiteUrl == url);
        }
    }
}