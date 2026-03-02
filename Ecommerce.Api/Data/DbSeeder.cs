using BCrypt.Net;
using Ecommerce.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (context.Users.Any()) return; 

        var users = new List<User>
        {
            new User
            {
                Name = "Admin",
                Email = "admin@email.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("1234567890"),
                Role = UserRole.Admin
            },
            new User
            {
                Name = "Customer",
                Email = "customer@email.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("0987654321"),
                Role = UserRole.Customer
            }
        };

        context.Users.AddRange(users);

        var products = new List<Product>
        {
            new Product
            {
                Name = "Fantastic Cotton Chair",
                Price = 102,
                ImageUrl = "http://placeimg.com/640/480/nature",
                Description = "The Football Is Good For Training And Recreational Purposes"
            },
            new Product
            {
                Name = "Lovely Marble Car",
                Price = 909,
                ImageUrl = "http://placeimg.com/640/480/city",
                Description = "The beautiful range of Apple Naturalé..."
            }
        };

        context.Products.AddRange(products);

        await context.SaveChangesAsync();
    }
}