using Backend.Data;
using Backend.Models;
using FluentValidation;
using Microsoft.AspNetCore.Identity;

namespace Backend.Service
{
    public class UserService(RSSDbContext context, IValidator<IdentityUser> validator) 
        : GenericService<IdentityUser>(context, validator)
    {
        public async Task<IdentityUser?> GetUserById(string id)
        {
            return await _context.Users.FindAsync(id);
        }
    }
}
