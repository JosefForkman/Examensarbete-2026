# RSS & Podcast Reader (Degree Project 2026)
A modern, aggregated platform for consuming RSS feeds and podcasts from YouTube Music and Spotify, built with a focus on performance and user experience.
## 🚀 Tech Stack
- **Orchestration:** [.NET Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/)
- **Backend:** .NET with [Hot Chocolate](https://chillicream.com/docs/hotchocolate) (GraphQL)
- **Database:** Entity Framework Core with PostgreSQL
- **Frontend:** Next.js 16+ (TypeScript) & [gql.tada](https://gql-tada.0no.co/)
## ✨ Key Features
- **Aggregated View:** Manage RSS subscriptions and podcasts from multiple sources in a single interface.
- **Search & Discover:** Global search functionality to find content across all your feeds.
- **Integrations:** Full support for Spotify and YouTube Music (search and existing subscriptions).
- **Library & History:** Save favorites, create playlists, and keep track of what you've read or listened to.
## 📈 Telemetry
The backend leverages OpenTelemetry to export traces and metrics directly to the **.NET Aspire Dashboard**. You can access the dashboard via the URL provided in the terminal when running the project (typically at `https://localhost:17037/`). Once in the dashboard, use the **Traces** tab to visualize the request lifecycle and the **Metrics** tab to monitor performance data in real-time.

A key feature of our setup is the instrumentation of **Hot Chocolate (GraphQL)** and **Entity Framework Core**. GraphQL requests are tracked to show execution plans and resolver performance, while database commands are wrapped in custom spans such as `EF Core reader` and `EF Core scalar`. This allows you to inspect the exact query type, duration, and any potential failures, providing deep visibility into both the API and database layers.

## 🛠️ Validation & Error Handling
We use a standardized approach for validating incoming data and handling common errors (like "Not Found") using **FluentValidation** and **Hot Chocolate's Error Handling**.

### Adding Validations to Mutations/Queries
When adding new CRUD operations or business logic, follow these steps to ensure consistent error responses:

1.  **Annotate the Method:** Add the `[Error<ValidationException>]` (and/or `[Error<NotFoundException>]`) attribute to your Mutation or Query method. This tells HotChocolate to catch these specific exceptions and include them in the GraphQL response `errors` field.
    *   **Multiple Exceptions:** You can stack multiple `[Error]` attributes if a method can throw different types of errors (e.g., both validation and not found).
2.  **Inject the Service:** Inject the `IGenericService<T>` into your method using the `[Service]` attribute.
3.  **Call Service Methods:** The `GenericService<T>` automatically runs fluent validations if a validator is registered for type `T`.

### Creating New Exception Types
If you need to handle a specific error case (e.g., `ConflictException`), follow these steps:
1.  **Create the Exception:** Add a new class in `Backend/Exception/` inheriting from `System.Exception`.
2.  **Throw it:** Throw your new exception in the Service when the error condition is met.
3.  **Register it:** Add the `[Error<YourNewException>]` annotation to your GraphQL method.

#### Example Usage:
```csharp
[MutationType]
public class MyMutation
{
    [Error<ValidationException>] // Catches validation errors
    [Error<NotFoundException>]   // Catches 404 errors
    public async Task<MyPayload> CreateItem(MyInput input,
        [Service] IGenericService<MyModel> service)
    {
        var item = new MyModel { /* map from input */ };
        
        // This call will throw ValidationException if FluentValidation fails
        var result = await service.CreateAsync(item);
        
        return new MyPayload { /* map from result */ };
    }
}
```

### Validation Rules
Validation rules are defined in the `Backend/Validation/` folder. Ensure your validator includes rule sets for "Create" or "Update" to be picked up by the `GenericService`.

## 🛠️ Architecture
The project utilizes a modern microservices-like architecture via **.NET Aspire**, facilitating local development, service discovery, and deployment. Communication between frontend and backend is handled via **GraphQL** to minimize data transfer and provide a type-safe development experience with **gql.tada**.
## 🏗️ Getting Started
### Prerequisites
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download) or later
- [Node.js](https://nodejs.org/) (LTS)
- [.NET Aspire workload](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/setup-tooling)
### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/JosefForkman/Examensarbete-2026.git
   ```
2. Run the project with .NET Aspire:
   ```bash
   dotnet run --project AppHost/AppHost.csproj
   ```
## 👥 Contributors
- **Josef Forkman** - *Developer and Designer* [GitHub Profile](https://github.com/JosefForkman)
- **Johan Svensson** - *Developer* [GitHub Profile](https://github.com/Darkdusk234)
---
*This project is developed as a degree project at Campus Varberg 2026, as part of the [.NET System Developer program](https://campus.varberg.se/yrkeshogskola/systemutvecklare-net).*
