using System.Net;
using System.Text.Json;

namespace Ecommerce.Api.Middleware;

// Yleinen error handler -> ei enää try/catch joka paikassa
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            var response = new
            {
                message = ex.Message,
                statusCode = 500
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));
        }
    }
}