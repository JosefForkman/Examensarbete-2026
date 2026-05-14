using Backend.Data;
using Backend.Service;
using Backend.Telemetry;
using Microsoft.EntityFrameworkCore;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<EfCoreTelemetryInterceptor>();
builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService(builder.Environment.ApplicationName))
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddSource(BackendTelemetry.ActivitySourceName)
        .AddOtlpExporter())
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddMeter(BackendTelemetry.MeterName)
        .AddOtlpExporter());
builder.Services.AddDbContext<RSSDbContext>((sp, options) =>
{
    var connectionString = builder.Configuration.GetConnectionString("mydb")
        ?? throw new InvalidOperationException("Connection string 'mydb' not found.");
    options.UseNpgsql(connectionString);
    options.AddInterceptors(sp.GetRequiredService<EfCoreTelemetryInterceptor>());
});
builder.Services.AddScoped(typeof(IGenericService<>), typeof(GenericService<>));
builder.Services.AddScoped<PostItemService>();
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
