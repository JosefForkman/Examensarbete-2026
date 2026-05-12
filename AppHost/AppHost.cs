var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder
                .AddPostgres("postgres")
                .WithHostPort(5432)
                .WithDataVolume()
                .WithLifetime(ContainerLifetime.Persistent)
                .WithPgAdmin();
var db = postgres.AddDatabase("mydb");

builder.AddProject<Projects.Backend>("backend")
    .WithReference(db)
    .WaitFor(db);

builder.Build().Run();
