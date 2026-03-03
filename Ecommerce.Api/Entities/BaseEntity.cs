namespace Ecommerce.Api.Entities;

// Perus entity josta kaikki perii
// Hoidetaan audit-kentät keskitetysti
public abstract class BaseEntity
{
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}