using System.ComponentModel.DataAnnotations;
using System.Net.Http.Json;
using System.ServiceModel.Syndication;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
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
                Console.WriteLine("¨The application was shutdown in a controlled manner.");
            }
        }

        static async Task Run(CancellationToken stoppingToken)
        {
            var now = DateTime.Now;

            var nextRunTime = new DateTime(now.Year, now.Month, now.Day, 12, 0, 0);

            if (now > nextRunTime)
            {
                nextRunTime = nextRunTime.AddDays(1);
            }

            var initialDelay = nextRunTime - now;

            try
            {
                await Task.Delay(initialDelay, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                return;
            }

            using var timer = new PeriodicTimer(TimeSpan.FromDays(1));

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
            var pagesNotCounted = true;

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
                              url
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
                    JsonSerializer.Serialize(requestBodyGet),
                    Encoding.UTF8,
                    "application/json"
                );

                var existingItemsResponse = await httpClient.PostAsync(endpoint, contentGet);

                if (!existingItemsResponse.IsSuccessStatusCode)
                {
                    var errorResponse = await existingItemsResponse.Content.ReadAsStringAsync();
                    Console.WriteLine($"GraphQL Server Error: {errorResponse}");
                    return;
                }

                var existingItemsContent = await existingItemsResponse.Content.ReadAsStringAsync();

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                var jsonDoc = JsonNode.Parse(existingItemsContent);

                var totalCount = jsonDoc?["data"]?["websites"]?["totalCount"]?.GetValue<int>() ?? 0;

                if (pagesNotCounted)
                {
                    pages = (int)Math.Ceiling((double)totalCount / 50);
                    pagesNotCounted = false;
                }

                var postItemsJson = jsonDoc?["data"]?["websites"]?["nodes"];

                var nextCursor = jsonDoc?["data"]?["websites"]?["pageInfo"]?["endCursor"]?.GetValue<string>();

                currentCursor = nextCursor;

                var existingItems = postItemsJson.Deserialize<List<Website>>(options) ?? new List<Website>();

                foreach (var website in existingItems)
                {
                    using var reader = XmlReader.Create(website.RSSUrl);
                    var feed = SyndicationFeed.Load(reader);

                    //LogFeedStructure(feed, "debug_feed_structure.txt");
                    //await UpdateItemsInDatabase(feed);
                    await UpdateWebsitesInDatabase(website, feed);
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
            var pagesNotCounted = true;

            for (int i = 0; i < pages; i++)
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
                    JsonSerializer.Serialize(requestBodyGet),
                    Encoding.UTF8,
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

                var totalCount = jsonDoc?["data"]?["postItems"]?["totalCount"]?.GetValue<int>() ?? 0;

                if (pagesNotCounted)
                {
                    pages = (int)Math.Ceiling((double)totalCount / 50);
                    pagesNotCounted = false;
                }

                var postItemsJson = jsonDoc?["data"]?["postItems"]?["nodes"];

                var nextCursor = jsonDoc?["data"]?["postItems"]?["pageInfo"]?["endCursor"]?.GetValue<string>();

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

        private static async Task UpdateWebsitesInDatabase(Website website, SyndicationFeed feed)
        {
            var httpClient = new HttpClient();
            var endpoint = "https://localhost:7095/graphql";

            var updateWebsiteMutation = @"
                mutation ($input: UpdateWebsiteInput!) {
                    updateWebsite(id: 1, input: $input) {
                        id
                    }
                }
            ";

            var latestWebsitePubDateQuery = @"
                query test($title: String!) {
                    postItems(
                        where: { websiteName: { eq: $title } }
                        order: { publicationDate: DESC }
                        first: 1
                    ) {
                        nodes {
                            publicationDate
                        }
                    }
                }
            ";

            var latestWebsitePubDateVariables = new
            {
                title = website.Name
            };
            var latestWebsitePubDateRequestBody = new
            {
                query = latestWebsitePubDateQuery,
                variables = latestWebsitePubDateVariables
            };

            var latestWebsitePubDateContent = new StringContent(
                            JsonSerializer.Serialize(latestWebsitePubDateRequestBody),
                            Encoding.UTF8,
                            "application/json"
                        );
            var latestWebsitePubDateHttpResponse = await httpClient.PostAsync(endpoint, latestWebsitePubDateContent);

            if (!latestWebsitePubDateHttpResponse.IsSuccessStatusCode)
            {
                return;
            }

            var createdAtData = await latestWebsitePubDateHttpResponse.Content.ReadFromJsonAsync<LatestWebsitePubDateResponse>();

            var createdAt = createdAtData?.Data.PostItems.Nodes.FirstOrDefault()?.PublicationDate.ToString("yyyy-MM-ddTHH:mm:ssZ");

            var feedWebsiteUrl = feed.Links.Where(link => link.MediaType is null)
                                        .Select(link => link.Uri.AbsoluteUri)
                                        .FirstOrDefault();

            var updateWebsiteVariables = new
            {
                input = new
                {
                    rssUrl = website.RSSUrl,
                    siteName = website.Name,
                    siteUrl = !string.IsNullOrEmpty(website.Uri) ? website.Uri : (feedWebsiteUrl ?? ""),
                    imageUrl = feed.ImageUrl.AbsoluteUri,
                    createdAt,
                    description = feed.Description.Text,

                }
            };
            var updateWebsiteRequestBody = new
            {
                query = updateWebsiteMutation,
                variables = updateWebsiteVariables
            };

            var updateWebsiteContent = new StringContent(
                            JsonSerializer.Serialize(updateWebsiteRequestBody),
                            Encoding.UTF8,
                            "application/json"
                        );

            var updateWebsiteHttpResponse = await httpClient.PostAsync(endpoint, updateWebsiteContent);

            if (!updateWebsiteHttpResponse.IsSuccessStatusCode)
            {
                Console.WriteLine(await updateWebsiteHttpResponse.Content.ReadAsStringAsync());
                return;
            }


            httpClient.Dispose();
        }

        public static async Task SaveItemsToDatabase(SyndicationFeed feed)
        {
            var httpClient = new HttpClient();
            var endpoint = "https://localhost:7095/graphql";
            var pages = 1;
            string? currentCursor = null;
            var existingItems = new List<PostItem>();
            var pagesNotCounted = true;

            for (int i = 0; i < pages; i++)
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
                    JsonSerializer.Serialize(requestBodyGet),
                    Encoding.UTF8,
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

                var totalCount = jsonDoc?["data"]?["postItems"]?["totalCount"]?.GetValue<int>() ?? 0;

                if (pagesNotCounted)
                {
                    pages = (int)Math.Ceiling((double)totalCount / 50);
                    pagesNotCounted = false;
                }

                var postItemsJson = jsonDoc?["data"]?["postItems"]?["nodes"];

                var nextCursor = jsonDoc?["data"]?["postItems"]?["pageInfo"]?["endCursor"]?.GetValue<string>();

                currentCursor = nextCursor;

                existingItems.AddRange(postItemsJson.Deserialize<List<PostItem>>(options) ?? new List<PostItem>());
            }

            // Create feedItem
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
                                        .Where(link => link.MediaType is not null && link.MediaType.StartsWith("audio/"))
                                        .Select(link => link.Uri.AbsoluteUri)
                                        .FirstOrDefault(),
                        publicationDate = item.PublishDate.ToString("yyyy-MM-ddTHH:mm:ssZ"),
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
                    JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json"
                );

                // Make request to backend
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
            public string Name { get; set; } = string.Empty;
            public string? Description { get; set; } = null;
            [Url]
            public string RSSUrl { get; set; } = string.Empty;
            [Url]
            public string Uri { get; set; } = string.Empty;
        }
        public class LatestWebsitePubDateResponse
        {
            [JsonPropertyName("data")]
            public LatestWebsitePubDateData Data { get; set; }
        }

        public class LatestWebsitePubDateData
        {
            [JsonPropertyName("postItems")]
            public LatestWebsitePubDatePostItems PostItems { get; set; }
        }

        public class LatestWebsitePubDatePostItems
        {
            [JsonPropertyName("nodes")]
            public List<LatestWebsitePubDateNode> Nodes { get; set; }
        }

        public class LatestWebsitePubDateNode
        {
            [JsonPropertyName("publicationDate")]
            public DateTime PublicationDate { get; set; }
        }
    }
}
