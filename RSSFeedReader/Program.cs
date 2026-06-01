using System.ComponentModel.DataAnnotations;
using System.ServiceModel.Syndication;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Xml;
using System.Xml.Linq;

namespace RSSFeedReader
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            using var cts = new CancellationTokenSource();

            Console.CancelKeyPress += (sender, eventArgs) =>
            {
                eventArgs.Cancel = true;

                cts.Cancel();
            };

            try
            {
                await Run(cts.Token);
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine("Applikationen stängdes av kontrollerat.");
            }
        }

        static async Task Run(CancellationToken stoppingToken)
        {
            DateTime nu = DateTime.Now;

            DateTime nastaKorning = new DateTime(nu.Year, nu.Month, nu.Day, 12, 0, 0);

            if (nu > nastaKorning)
            {
                nastaKorning = nastaKorning.AddDays(1);
            }

            TimeSpan initialFordrojning = nastaKorning - nu;

            try
            {
                await Task.Delay(initialFordrojning, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                return;
            }

            using PeriodicTimer timer = new PeriodicTimer(TimeSpan.FromDays(1));

            do
            {
                await SavePostItemsForEachWebsite();
            }
            while (await timer.WaitForNextTickAsync(stoppingToken));
        }


        public static async Task SavePostItemsForEachWebsite()
        {
            var httpClient = new HttpClient();
            var endpoint = "https://localhost:7095/graphql";
            var pages = 1;
            string? currentCursor = null;
            bool pagesNotCounted = true;

            for (int i = 0; i < pages; i++)
            {

                var requestBodyGet = new
                {
                    query = @"
                        query GetWebsites($after: String){
                          websites(first: 50, after: $after) {
                            nodes {
                              name
                              rssUrl
                            }
                            pageInfo {
                              endCursor
                            }
                            totalCount
                          }
                        }",

                    variables = new
                    {
                        after = currentCursor
                    }
                };

                var contentGet = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(requestBodyGet),
                    System.Text.Encoding.UTF8,
                    "application/json"
                );

                var existingItemsResponse = await httpClient.PostAsync(endpoint, contentGet);

                if (!existingItemsResponse.IsSuccessStatusCode)
                {
                    string errorResponse = await existingItemsResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"GraphQL Server Error: {errorResponse}");
                    return;
                }

                var existingItemsContent = await existingItemsResponse.Content.ReadAsStringAsync();

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                var jsonDoc = JsonNode.Parse(existingItemsContent);

                int totalCount = jsonDoc?["data"]?["websites"]?["totalCount"]?.GetValue<int>() ?? 0;

                if (pagesNotCounted)
                {
                    pages = (int)Math.Ceiling((double)totalCount / 50);
                    pagesNotCounted = false;
                }

                var postItemsJson = jsonDoc?["data"]?["websites"]?["nodes"];

                string? nextCursor = jsonDoc?["data"]?["websites"]?["pageInfo"]?["endCursor"]?.GetValue<string>();

                currentCursor = nextCursor;

                var existingItems = postItemsJson.Deserialize<List<Website>>(options) ?? new List<Website>();

                foreach (var website in existingItems)
                {
                    using var reader = XmlReader.Create(website.RSSUrl);
                    var feed = SyndicationFeed.Load(reader);

                    //LogFeedStructure(feed, "debug_feed_structure.txt");
                    //await UpdateItemsInDatabase(feed);
                    await SaveItemsToDatabase(feed);
                }
            }
        }

        public static async Task UpdateItemsInDatabase(SyndicationFeed feed)
        {
            var httpClient = new HttpClient();
            var endpoint = "https://localhost:7095/graphql";
            var pages = 1;
            string? currentCursor = null;
            bool pagesNotCounted = true;

            for (int i = 0; i<pages; i++)
            {
                var requestBodyGet = new
                {
                    query = @"
                        query GetPostItems($after: String){
                          postItems(first: 50, after: $after, order: { id: ASC }) {
                            nodes {
                              id
                              title
                              postId
                            }
                            pageInfo {
                              endCursor
                            }
                            totalCount
                          }
                        }",
                    
                    variables = new
                    {
                        after = currentCursor
                    }
                };

                var contentGet = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(requestBodyGet),
                    System.Text.Encoding.UTF8,
                    "application/json"
                );

                var existingItemsResponse = await httpClient.PostAsync(endpoint, contentGet);

                if (!existingItemsResponse.IsSuccessStatusCode)
                {
                    string errorResponse = await existingItemsResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"GraphQL Server Error: {errorResponse}");
                    return;
                }

                var existingItemsContent = await existingItemsResponse.Content.ReadAsStringAsync();

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                var jsonDoc = JsonNode.Parse(existingItemsContent);

                int totalCount = jsonDoc?["data"]?["postItems"]?["totalCount"]?.GetValue<int>() ?? 0;

                if (pagesNotCounted)
                {
                    pages = (int)Math.Ceiling((double)totalCount / 50);
                    pagesNotCounted = false;
                }

                var postItemsJson = jsonDoc?["data"]?["postItems"]?["nodes"];

                string? nextCursor = jsonDoc?["data"]?["postItems"]?["pageInfo"]?["endCursor"]?.GetValue<string>();

                currentCursor = nextCursor;

                var existingItems = postItemsJson.Deserialize<List<PostItem>>(options) ?? new List<PostItem>();

                foreach (var item in existingItems)
                {
                    var matchingFeedItem = feed.Items.FirstOrDefault(feedItem =>
                    string.Equals(feedItem.Id, item.PostId, StringComparison.OrdinalIgnoreCase));

                    if (matchingFeedItem != null)
                    {
                        var query = @"
                        mutation UpdatePostItem($id: Int!, $input: UpdatePostItemInput!) {
                          updatePostItem(id: $id, input: $input) {
                            id
                            title
                            description
                            link
                            imageUrl
                            publicationDate
                            websiteId
                          }
                        }";
                        var variables = new
                        {
                            id = item.Id,
                            input = new
                            {
                                title = matchingFeedItem.Title.Text ?? "",
                                description = feed.Description?.Text ?? "",
                                link = matchingFeedItem.Links
                                        .Select(link => link.Uri?.ToString())?
                                        .Where(uri => uri.Contains(".mp3", StringComparison.OrdinalIgnoreCase))?
                                        .FirstOrDefault()?.ToString() ?? "",
                                publicationDate = matchingFeedItem.PublishDate.UtcDateTime,
                                imageUrl = matchingFeedItem.ElementExtensions
                                    .ReadElementExtensions<XElement>(
                                        "image",
                                        "http://www.itunes.com/dtds/podcast-1.0.dtd"
                                    )
                                    .FirstOrDefault()?.Attribute("href")?.Value ?? "",
                                postId = matchingFeedItem.Id,
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
                            Console.WriteLine($"Item '{matchingFeedItem.Title.Text}' updated successfully.");
                        }
                        else
                        {
                            Console.WriteLine($"Failed to update item '{matchingFeedItem.Title.Text}': {responseString}");
                        }
                    }
                }
            }
        }

        public static async Task SaveItemsToDatabase(SyndicationFeed feed)
        {
            var httpClient = new HttpClient();
            var endpoint = "https://localhost:7095/graphql";
            var pages = 1;
            string? currentCursor = null;
            var existingItems = new List<PostItem>();
            bool pagesNotCounted = true;

            for (int i = 0; i<pages; i++)
            {
                var requestBodyGet = new
                {
                    query = @"
                        query GetPostItems($after: String){
                          postItems(first: 50, after: $after, order: { id: ASC }) {
                            nodes {
                              id
                              title
                              postId
                            }
                            pageInfo {
                              endCursor
                            }
                            totalCount
                          }
                        }",

                    variables = new
                    {
                        after = currentCursor
                    }
                };

                var contentGet = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(requestBodyGet),
                    System.Text.Encoding.UTF8,
                    "application/json"
                );

                var existingItemsResponse = await httpClient.PostAsync(endpoint, contentGet);

                if (!existingItemsResponse.IsSuccessStatusCode)
                {
                    string errorResponse = await existingItemsResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"GraphQL Server Error: {errorResponse}");
                    return;
                }

                var existingItemsContent = await existingItemsResponse.Content.ReadAsStringAsync();

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                var jsonDoc = JsonNode.Parse(existingItemsContent);

                int totalCount = jsonDoc?["data"]?["postItems"]?["totalCount"]?.GetValue<int>() ?? 0;

                if (pagesNotCounted)
                {
                    pages = (int)Math.Ceiling((double)totalCount / 50);
                    pagesNotCounted = false;
                }

                var postItemsJson = jsonDoc?["data"]?["postItems"]?["nodes"];

                string? nextCursor = jsonDoc?["data"]?["postItems"]?["pageInfo"]?["endCursor"]?.GetValue<string>();

                currentCursor = nextCursor;

                existingItems.AddRange(postItemsJson.Deserialize<List<PostItem>>(options) ?? new List<PostItem>());
            }

            foreach (var item in feed.Items)
            {
                if (existingItems.Any(existingItem => string.Equals(existingItem.PostId, item.Id, StringComparison.OrdinalIgnoreCase)))
                {
                    Console.WriteLine($"Item '{item.Title.Text}' already exists. Skipping.");
                    continue;
                }

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
                        postId = item.Id,
                        imageUrl = imageUrl,
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

        public class PostItem
        {
            [Key]
            public int Id { get; set; }
            [Required]
            public string Title { get; set; } = string.Empty;
            public string? Description { get; set; }
            [Required]
            public string Link { get; set; } = string.Empty;
            public string? ImageUrl { get; set; }
            public DateTime PublicationDate { get; set; }
            public string PostId { get; set; } = string.Empty; // Unique identifier for the post, can be used to prevent duplicates
            public int WebsiteId { get; set; }
        }

        public class Website
        {
            [Key]
            public int Id { get; set; }
            public string SiteName { get; set; } = string.Empty;
            [Url]
            public string RSSUrl { get; set; } = string.Empty;
            [Url]
            public string SiteUrl { get; set; } = string.Empty;
        }
    }
}
