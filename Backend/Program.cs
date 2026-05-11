using Backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = "Host=localhost;Port=61154;Username=postgres;Password=_zYP0_-HY6CsZJX6tg_n(7;Database=mydb";
    //builder.Configuration.GetConnectionString("mydb")
    //?? throw new InvalidOperationException("Connection string 'mydb' not found.");

builder.Services.AddDbContextFactory<Backend.Data.RSSDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.AddGraphQL().AddTypes();

var app = builder.Build();

app.MapGraphQL();

app.RunWithGraphQLCommands(args);
