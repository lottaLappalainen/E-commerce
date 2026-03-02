using Ecommerce.Api.Entities;

namespace Ecommerce.Api.Services;

public interface IUserService
{
    Task<List<User>> GetAllAsync();
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> UpdateRoleAsync(Guid id, string role);
    Task<bool> DeleteAsync(Guid id);
}