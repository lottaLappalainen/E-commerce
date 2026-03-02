using System.ComponentModel.DataAnnotations.Schema;

namespace Ecommerce.Api.Entities;

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid CustomerId { get; set; }

    public User Customer { get; set; } = null!;

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}