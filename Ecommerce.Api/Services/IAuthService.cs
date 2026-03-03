using Ecommerce.Api.DTOs;

namespace Ecommerce.Api.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> LoginAsync(string email, string password);
    Task<AuthResponseDto?> RegisterAsync(string name, string email, string password);
    Task<AuthResponseDto?> RefreshTokenAsync(string refreshToken);
}