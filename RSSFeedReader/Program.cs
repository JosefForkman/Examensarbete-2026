using System.ServiceModel.Syndication;
using System.Text;
using System.Xml;

namespace RSSFeedReader
{
    internal class Program
    {
        static void Main(string[] args)
        {
            using var reader = XmlReader.Create("https://feeds.megaphone.fm/FSI1483080183");
            var feed = SyndicationFeed.Load(reader);

            LogFeedStructure(feed, "debug_feed_structure.txt");
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
