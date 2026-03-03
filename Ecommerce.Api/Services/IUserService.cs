using Ecommerce.Api.DTOs;

namespace Ecommerce.Api.Services;

public interface IUserService
{
    Task<List<UserDto>> GetAllAsync();
    Task<UserDto?> GetByIdAsync(Guid id);
    Task<UserDto?> UpdateRoleAsync(Guid id, string role);
    Task<UserDto?> DeleteAsync(Guid id);
}