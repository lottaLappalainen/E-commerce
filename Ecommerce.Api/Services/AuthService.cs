using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace Ecommerce.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        AppDbContext context,
        IConfiguration config,
        ILogger<AuthService> logger)
    {
        _context = context;
        _config = config;
        _logger = logger;
    }

    public async Task<AuthResponseDto?> RegisterAsync(string name, string email, string password)
    {
        _logger.LogInformation("Attempting registration for email {Email}", email);

        if (await _context.Users.AnyAsync(u => u.Email == email))
        {
            _logger.LogWarning("Registration failed. Email already exists: {Email}", email);
            return null;
        }

        var user = new User
        {
            Name = name,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User registered successfully with Id {UserId}", user.Id);

        return await GenerateAuthResponse(user);
    }

    public async Task<AuthResponseDto?> LoginAsync(string email, string password)
    {
        _logger.LogInformation("Login attempt for {Email}", email);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            _logger.LogWarning("Login failed. User not found for {Email}", email);
            return null;
        }

        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            _logger.LogWarning("Login failed. Invalid password for {Email}", email);
            return null;
        }

        _logger.LogInformation("Login successful for user {UserId}", user.Id);

        return await GenerateAuthResponse(user);
    }

    public async Task<AuthResponseDto?> RefreshTokenAsync(string refreshToken)
    {
        _logger.LogInformation("Refresh token attempt");

        var users = await _context.Users
            .Where(u => u.RefreshTokenHash != null && u.RefreshTokenExpiry > DateTime.UtcNow)
            .ToListAsync();

        var user = users.FirstOrDefault(u =>
            BCrypt.Net.BCrypt.Verify(refreshToken, u.RefreshTokenHash));

        if (user == null)
        {
            _logger.LogWarning("Refresh token invalid or expired");
            return null;
        }

        _logger.LogInformation("Refresh token successful for user {UserId}", user.Id);

        return await GenerateAuthResponse(user);
    }

    private async Task<AuthResponseDto> GenerateAuthResponse(User user)
    {
        var accessToken = GenerateJwt(user);
        var refreshToken = GenerateSecureRefreshToken();

        user.RefreshTokenHash = BCrypt.Net.BCrypt.HashPassword(refreshToken);
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role.ToString().ToLower(),
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    private string GenerateJwt(User user)
    {
        var claims = new[]
        {
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateSecureRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}