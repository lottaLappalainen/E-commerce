using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Services;

namespace Ecommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CheckoutController : ControllerBase
{
    private readonly ICheckoutService _checkoutService;

    public CheckoutController(ICheckoutService checkoutService)
    {
        _checkoutService = checkoutService;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<OrderDto>> Checkout(CheckoutRequestDto dto)
    {
        var userId = User.FindFirst("id")?.Value;

        if (userId == null)
            return Unauthorized();

        var order = await _checkoutService.CreateOrderAsync(Guid.Parse(userId), dto);

        return Ok(order);
    }
}