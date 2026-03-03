using AutoMapper;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Ecommerce.Api.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<ProductService> _logger;

    public ProductService(
        AppDbContext context,
        IMapper mapper,
        ILogger<ProductService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<List<ProductDto>> GetAllAsync()
    {
        _logger.LogInformation("Fetching all products");

        var products = await _context.Products
            .AsNoTracking()
            .ToListAsync();

        _logger.LogInformation("Fetched {Count} products", products.Count);

        return _mapper.Map<List<ProductDto>>(products);
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        _logger.LogInformation("Fetching product {ProductId}", id);

        var product = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            _logger.LogWarning("Product not found {ProductId}", id);

        return product == null ? null : _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto> CreateAsync(ProductCreateDto dto)
    {
        _logger.LogInformation("Creating new product {ProductName}", dto.Name);

        var product = _mapper.Map<Product>(dto);

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Product created with Id {ProductId}", product.Id);

        return _mapper.Map<ProductDto>(product);
    }

    public async Task<ProductDto?> UpdateAsync(Guid id, ProductUpdateDto dto)
    {
        _logger.LogInformation("Updating product {ProductId}", id);

        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            _logger.LogWarning("Update failed. Product not found {ProductId}", id);
            return null;
        }

        product.Name = dto.Name ?? product.Name;
        product.Price = dto.Price ?? product.Price;
        product.Description = dto.Description;
        product.ImageUrl = dto.ImageUrl;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Product updated {ProductId}", id);

        return _mapper.Map<ProductDto>(product);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        _logger.LogInformation("Deleting product {ProductId}", id);

        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            _logger.LogWarning("Delete failed. Product not found {ProductId}", id);
            return false;
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Product deleted {ProductId}", id);

        return true;
    }
}