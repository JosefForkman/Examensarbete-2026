using Backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// var connectionString = builder.Configuration.GetConnectionString("mydb")
//     ?? throw new InvalidOperationException("Connection string 'mydb' not found.");

builder.Services.AddDbContext<RSSDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("mydb")
        ?? throw new InvalidOperationException("Connection string 'mydb' not found.");

    options.UseNpgsql(connectionString);
});

builder.EnrichNpgsqlDbContext<RSSDbContext>();

builder.AddGraphQL().AddTypes();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<RSSDbContext>();
    await context.Database.MigrateAsync();
}

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
