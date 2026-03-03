using AutoMapper;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public OrderService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<OrderDto>> GetAllAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .AsNoTracking()
            .ToListAsync();

        return _mapper.Map<List<OrderDto>>(orders);
    }

    public async Task<OrderDto?> GetByIdAsync(Guid id)
    {
        var order = await _context.Orders
            .Include(o => o.Customer)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id);

        return order == null ? null : _mapper.Map<OrderDto>(order);
    }

    public async Task<OrderDto> CreateAsync(CreateOrderDto dto)
    {
        if (!dto.Items.Any())
            throw new Exception("Order must contain at least one item");

        var productIds = dto.Items.Select(i => i.ProductId).ToList();

        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync();

        if (products.Count != productIds.Count)
            throw new Exception("Invalid product in order");

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

        return _mapper.Map<OrderDto>(order);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return false;

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();
        return true;
    }
}