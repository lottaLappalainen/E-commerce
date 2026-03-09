using Ecommerce.Api.DTOs;

namespace Ecommerce.Api.Services;

public interface ICheckoutService
{
    Task<OrderDto> CreateOrderAsync(Guid customerId, CheckoutRequestDto dto);
}