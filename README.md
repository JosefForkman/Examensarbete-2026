# RSS & Podcast Reader (Examensarbete 2026)

En modern, aggregerad plattform för att konsumera RSS-flöden och podcasts från YouTube Music och Spotify, byggd med fokus på prestanda och användarupplevelse.

## 🚀 Teknisk Stack

- **Orkestrering:** [.NET Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/)
- **Backend:** .NET med [Hot Chocolate](https://chillicream.com/docs/hotchocolate) (GraphQL)
- **Databas:** Entity Framework Core med SQLite
- **Frontend:** Next.js 16+ (TypeScript) & [gql.tada](https://gql-tada.0no.co/)

## ✨ Nyckelfunktioner

- **Aggregerad vy:** Hantera RSS-prenumerationer och podcasts från flera källor i ett och samma gränssnitt.
- **Sök & Upptäck:** Global sökfunktion för att hitta innehåll i alla dina flöden.
- **Integrationer:** Fullt stöd för Spotify och YouTube Music (sökning och befintliga prenumerationer).
- **Bibliotek & Historik:** Spara favoriter, skapa spellistor och håll koll på vad du har läst eller lyssnat på.

## 🛠️ Arkitektur

Projektet använder en modern mikrotjänst-liknande arkitektur via **.NET Aspire**, vilket underlättar lokal utveckling, tjänsteupptäckt och deployment. Kommunikationen mellan frontend och backend sker via **GraphQL** för att minimera datatrafik och ge en typsäker utvecklingsupplevelse med **gql.tada**.

## 🏗️ Kom igång

### Förutsättningar
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download) eller senare
- [Node.js](https://nodejs.org/) (LTS)
- [.NET Aspire workload](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/setup-tooling)

### Installation
1. Klona repot:
   ```bash
   git clone https://github.com/ditt-användarnamn/examensarbete-2026.git
   ```
2. Starta projektet med .NET Aspire:
   ```bash
   dotnet run --project AspireApp.AppHost
   ```

---
*Detta projekt utvecklas som ett examensarbete vid Campus Varberg 2026. På [Systemutvecklare .NET utbildningen](https://campus.varberg.se/yrkeshogskola/systemutvecklare-net) *
