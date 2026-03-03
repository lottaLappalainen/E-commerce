namespace Ecommerce.Api.Entities;

public class Order : BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid CustomerId { get; set; }
    public User Customer { get; set; } = null!;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    // Lasketaan aina serverillä ettei voi manipuloida
    public decimal TotalPrice =>
        Items.Sum(i => i.Quantity * i.UnitPrice);
}