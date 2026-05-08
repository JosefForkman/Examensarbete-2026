var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres");
var db = postgres.AddDatabase("mydb");

builder.AddProject<Projects.Backend>("backend")
    .WithReference(db)
    .WaitFor(db);

builder.Build().Run();
