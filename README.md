# RSS & Podcast Reader (Degree Project 2026)
A modern, aggregated platform for consuming RSS feeds and podcasts from YouTube Music and Spotify, built with a focus on performance and user experience.
## 🚀 Tech Stack
- **Orchestration:** [.NET Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/)
- **Backend:** .NET with [Hot Chocolate](https://chillicream.com/docs/hotchocolate) (GraphQL)
- **Database:** Entity Framework Core with SQLite
- **Frontend:** Next.js 16+ (TypeScript) & [gql.tada](https://gql-tada.0no.co/)
## ✨ Key Features
- **Aggregated View:** Manage RSS subscriptions and podcasts from multiple sources in a single interface.
- **Search & Discover:** Global search functionality to find content across all your feeds.
- **Integrations:** Full support for Spotify and YouTube Music (search and existing subscriptions).
- **Library & History:** Save favorites, create playlists, and keep track of what you've read or listened to.
## 📈 Telemetry
- The backend exports **traces** and **metrics** to the Aspire dashboard through OpenTelemetry.
- EF Core database commands are wrapped in custom spans, so you can see the exact query kind, duration, and failures.
- Look for spans named like `EF Core reader`, `EF Core nonquery`, and `EF Core scalar` when you run the app.
- Custom metrics include EF command count, failure count, and command duration.
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
