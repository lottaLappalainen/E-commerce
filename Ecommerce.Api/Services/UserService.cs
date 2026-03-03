using AutoMapper;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Api.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<UserService> _logger;

    public UserService(
        AppDbContext context,
        IMapper mapper,
        ILogger<UserService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<List<UserDto>> GetAllAsync()
    {
        _logger.LogInformation("Fetching all users");

        var users = await _context.Users
            .AsNoTracking()
            .ToListAsync();

        _logger.LogInformation("Fetched {Count} users", users.Count);

        return _mapper.Map<List<UserDto>>(users);
    }

    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching user {UserId}", id);

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            _logger.LogWarning("User not found {UserId}", id);

        return user == null ? null : _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> UpdateRoleAsync(Guid id, string role)
    {
        _logger.LogInformation("Updating role for user {UserId} to {Role}", id, role);

        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            _logger.LogWarning("Role update failed. User not found {UserId}", id);
            return null;
        }

        user.Role = Enum.Parse<UserRole>(role, true);

        await _context.SaveChangesAsync();

        _logger.LogInformation("User role updated {UserId}", id);

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> DeleteAsync(Guid id)
    {
        _logger.LogInformation("Deleting user {UserId}", id);

        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            _logger.LogWarning("Delete failed. User not found {UserId}", id);
            return null;
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User deleted {UserId}", id);

        return _mapper.Map<UserDto>(user);
    }
}