using Ecommerce.Api.DTOs;

namespace Ecommerce.Api.Services;

public interface IOrderService
{
    Task<List<OrderDto>> GetAllAsync();
    Task<OrderDto?> GetByIdAsync(Guid id);
    Task<OrderDto> CreateAsync(CreateOrderDto dto);
    Task<bool> DeleteAsync(Guid id);
}