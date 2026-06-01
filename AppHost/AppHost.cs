var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder
                .AddPostgres("postgres")
                .WithHostPort(5432)
                .WithDataVolume()
                .WithLifetime(ContainerLifetime.Persistent)
                .WithPgAdmin();
var db = postgres.AddDatabase("mydb");

var backend = builder.AddProject<Projects.Backend>("backend")
    .WithReference(db)
    .WaitFor(db);

var rssFeedReader = builder.AddProject<Projects.RSSFeedReader>("rss-feed-reader")
    .WithReference(db)
    .WaitFor(db);

#pragma warning disable ASPIREJAVASCRIPT001
builder.AddNextJsApp("frontend", "../frontend")
    .WithReference(backend)
    .WaitFor(backend)
    .WithExternalHttpEndpoints();
#pragma warning restore ASPIREJAVASCRIPT001

builder.Build().Run();
