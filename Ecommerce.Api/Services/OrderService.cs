using AutoMapper;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Api.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        AppDbContext context,
        IMapper mapper,
        ILogger<OrderService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<List<OrderDto>> GetAllAsync()
    {
        _logger.LogInformation("Fetching all orders");

        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .AsNoTracking()
            .ToListAsync();

        _logger.LogInformation("Fetched {Count} orders", orders.Count);

        return _mapper.Map<List<OrderDto>>(orders);
    }

    public async Task<OrderDto?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching order {OrderId}", id);

        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            _logger.LogWarning("Order not found {OrderId}", id);

        return order == null ? null : _mapper.Map<OrderDto>(order);
    }

    public async Task<OrderDto> CreateAsync(CreateOrderDto dto)
    {
        _logger.LogInformation("Creating order for user {UserId}", dto.UserId);

        if (!dto.Items.Any())
            throw new Exception("Order must contain at least one item");

        var productIds = dto.Items.Select(i => i.ProductId).ToList();

        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync();

        if (products.Count != productIds.Count)
        {
            _logger.LogWarning("Order creation failed due to invalid product");
            throw new Exception("Invalid product in order");
        }

        var order = new Order
        {
            CustomerId = dto.UserId
        };

        foreach (var item in dto.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);

            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price
            });
        }

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Order created with Id {OrderId}", order.Id);

        return _mapper.Map<OrderDto>(order);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        _logger.LogInformation("Deleting order {OrderId}", id);

        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            _logger.LogWarning("Order not found for deletion {OrderId}", id);
            return false;
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Order deleted {OrderId}", id);

        return true;
    }
}