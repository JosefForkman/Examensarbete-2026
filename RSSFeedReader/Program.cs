using System.ServiceModel.Syndication;
using System.Text;
using System.Xml;
using System.Xml.Linq;

namespace RSSFeedReader
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            using var reader = XmlReader.Create("https://feeds.megaphone.fm/FSI1483080183");
            var feed = SyndicationFeed.Load(reader);

            //LogFeedStructure(feed, "debug_feed_structure.txt");
            await SaveItemsToDatabase(feed);
        }

        public static async Task SaveItemsToDatabase(SyndicationFeed feed)
        {
            var httpClient = new HttpClient();
            var endpoint = "https://localhost:7095/graphql";

            foreach (var item in feed.Items)
            {
                var query = @"
                mutation CreatePostItem($input: CreatePostItemInput!) {
                  createPostItem(input: $input) {
                    id
                    title
                    description
                    link
                    imageUrl
                    publicationDate
                    websiteId
                  }
                }";

                var imageElement = item.ElementExtensions
                    .ReadElementExtensions<XElement>(
                        "image",
                        "http://www.itunes.com/dtds/podcast-1.0.dtd"
                    )
                    .FirstOrDefault();

                var imageUrl = imageElement?.Attribute("href")?.Value;

                var variables = new
                {
                    input = new
                    {
                        title = item.Title.Text ?? "",
                        description = feed.Description?.Text ?? "",
                        link = item.Links
                            .Select(link => link.Uri?.ToString())?
                            .Where(uri => uri.EndsWith(".mp3", StringComparison.OrdinalIgnoreCase))?
                            .FirstOrDefault()?.ToString() ?? "",
                        publicationDate = item.PublishDate.UtcDateTime,
                        PostId = item.Id,
                        ImageUrl = imageUrl,
                        websiteUrl = "https://www.syntax.fm/"
                    }
                };

                var requestBody = new
                {
                    query = query,
                    variables = variables
                };

                var content = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await httpClient.PostAsync(endpoint, content);
                var responseString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Item '{item.Title.Text}' saved successfully.");
                }
                else
                {
                    Console.WriteLine($"Failed to save item '{item.Title.Text}': {responseString}");
                }
            }
        }

        public static void LogFeedStructure(SyndicationFeed feed, string filePath)
        {
            var sb = new StringBuilder();

            sb.AppendLine("=== FEED STRUCTURE ===");
            sb.AppendLine($"Title: {feed.Title?.Text}");
            sb.AppendLine($"Description: {feed.Description?.Text}");
            sb.AppendLine($"ID: {feed.Id}");
            sb.AppendLine($"Last Updated: {feed.LastUpdatedTime}");
            sb.AppendLine();

            int index = 0;
            foreach (var item in feed.Items)
            {
                index++;

                sb.AppendLine($"ITEM {index}");
                sb.AppendLine($"  Title: {item.Title?.Text}");
                sb.AppendLine($"  Summary: {item.Summary?.Text}");
                if (item.PublishDate != default)
                    sb.AppendLine($"  Published: {item.PublishDate}");
                sb.AppendLine($"  ID: {item.Id}");
                sb.AppendLine($"  Base Uri: {item.BaseUri}");
                sb.AppendLine($"  Links:");

                foreach (var link in item.Links)
                {
                    sb.AppendLine($"    {link.Uri} ({link.RelationshipType}, {link.MediaType})");
                }
                sb.AppendLine();
            }

            File.WriteAllText(filePath, sb.ToString(), Encoding.UTF8);
        }
    }
}
