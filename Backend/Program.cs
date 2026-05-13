using Backend.Data;
using Backend.Models;
using Backend.Service;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<RSSDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("mydb")
        ?? throw new InvalidOperationException("Connection string 'mydb' not found.");

    options.UseNpgsql(connectionString);
});

builder.Services.AddScoped(typeof(IGenericService<>), typeof(GenericService<>));

builder.EnrichNpgsqlDbContext<RSSDbContext>();

builder.AddGraphQL()
    .AddTypes()
    .AddProjections()
    .AddFiltering()
    .AddSorting();

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
