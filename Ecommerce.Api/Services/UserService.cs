using Ecommerce.Api.Data;
using Ecommerce.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetAllAsync()
        => await _context.Users
            .AsNoTracking()
            .ToListAsync();

    public async Task<User?> GetByIdAsync(Guid id)
        => await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id);

    public async Task<User?> UpdateRoleAsync(Guid id, string role)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        user.Role = Enum.Parse<UserRole>(role, true);

        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }
}