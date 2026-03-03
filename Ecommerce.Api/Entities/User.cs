using System.ComponentModel.DataAnnotations;

namespace Ecommerce.Api.Entities;

public class User : BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.Customer;

    // Refresh token turvallisesti hashattuna
    public string? RefreshTokenHash { get; set; }
    public DateTime? RefreshTokenExpiry { get; set; }

    public ICollection<Order> Orders { get; set; } = new List<Order>();
}