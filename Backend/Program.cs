using Backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("mydb")
    ?? throw new InvalidOperationException("Connection string 'mydb' not found.");

builder.Services.AddDbContextFactory<Backend.Data.DbContext>(options =>
    options.UseNpgsql(connectionString));

builder.AddGraphQL().AddTypes();

var app = builder.Build();

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
