using Backend.Data;
using Backend.Service;
using Backend.Telemetry;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add modular configurations
builder.AddApplicationTelemetry();

// Database configuration
builder.Services.AddDbContext<RSSDbContext>((sp, options) =>
{
    var connectionString = builder.Configuration.GetConnectionString("mydb")
        ?? throw new InvalidOperationException("Connection string 'mydb' not found.");
    options.UseNpgsql(connectionString);
    options.AddInterceptors(sp.GetRequiredService<EfCoreTelemetryInterceptor>());
});

// Services
builder.Services.AddSingleton<EfCoreTelemetryInterceptor>();
builder.Services.AddScoped(typeof(IGenericService<>), typeof(GenericService<>));
builder.Services.AddScoped<PostItemService>();
builder.Services.AddScoped<WebsiteService>();

builder.Services.AddScoped<EfCoreTelemetryInterceptor>();

// Add FluentValidation Dependency
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

builder.EnrichNpgsqlDbContext<RSSDbContext>();

builder.AddGraphQL()
            .AddTypes()
            .AddProjections()
            .AddFiltering()
            .AddSorting()
            .AddQueryConventions()
            .AddMutationConventions()
            .AddInstrumentation();

var app = builder.Build();

// Apply pending migrations at startup
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<RSSDbContext>();
    await context.Database.MigrateAsync();
}

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
