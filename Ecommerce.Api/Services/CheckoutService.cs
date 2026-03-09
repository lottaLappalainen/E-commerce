using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Entities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Ecommerce.Api.Services;

public class CheckoutService : ICheckoutService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public CheckoutService(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<OrderDto> CreateOrderAsync(Guid customerId, CheckoutRequestDto dto)
    {
        var productIds = dto.Items.Select(i => i.ProductId);

        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync();

        var order = new Order
        {
            CustomerId = customerId
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
}