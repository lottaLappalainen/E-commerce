namespace Ecommerce.Api.DTOs;

public class OrderDto
{
    public Guid Id { get; set; }
    public string CustomerEmail { get; set; } = default!;
    public decimal TotalPrice { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}