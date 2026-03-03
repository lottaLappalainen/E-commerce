using AutoMapper;
using Ecommerce.Api.Entities;
using Ecommerce.Api.DTOs;

namespace Ecommerce.Api.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Role,
                opt => opt.MapFrom(src => src.Role.ToString()));

        CreateMap<Product, ProductDto>();

        CreateMap<ProductCreateDto, Product>();

        CreateMap<ProductUpdateDto, Product>()
            .ForAllMembers(opts => 
                opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<OrderItem, OrderItemDto>()
            .ForMember(dest => dest.ProductName,
                opt => opt.MapFrom(src => src.Product.Name));

        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.CustomerEmail,
                opt => opt.MapFrom(src => src.Customer.Email));
    }
}