using Ecommerce.Api.Entities;

namespace Ecommerce.Api.Services;

public interface IProductService
{
    Task<List<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(Guid id);
    Task<Product> CreateAsync(Product product);
    Task<Product?> UpdateAsync(Guid id, Product updated);
    Task<bool> DeleteAsync(Guid id);
}