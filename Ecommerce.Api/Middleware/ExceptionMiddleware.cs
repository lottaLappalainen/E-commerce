using System.Net;
using System.Text.Json;
using Serilog;

namespace Ecommerce.Api.Middleware;

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
            Log.Error(ex, "Unhandled exception occurred.");

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";

            var response = new
            {
                message = "Something went wrong.",
                statusCode = 500
            };

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));
        }
    }
}