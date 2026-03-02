using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Ecommerce.Api.Services;
using Ecommerce.Api.DTOs;
using System.Security.Claims;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto.Name, dto.Email, dto.Password);

        if (result == null)
            return BadRequest(new { error = "Email already exists" });

        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto.Email, dto.Password);

        if (result == null)
            return Unauthorized(new { error = "Invalid email or password" });

        return Ok(result);
    }

    [Authorize]
    [HttpGet("check-status")]
    public IActionResult CheckStatus()
    {
        var id = User.FindFirst("id")?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        return Ok(new
        {
            user = new
            {
                id,
                username,
                email,
                role = role?.ToLower()
            }
        });
    }

    [Authorize]
    [HttpGet("logout")]
    public IActionResult Logout()
    {
        return Ok(new { message = "Logged out" });
    }
}