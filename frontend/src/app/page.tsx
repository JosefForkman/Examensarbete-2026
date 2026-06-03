import Card from "@/component/Card";
import { client, graphql } from "@/gql";

export default async function Home() {
    const postItemsQuery = graphql(`
        query {
            postItems {
                nodes {
                    id
                    title
                    imageUrl
                }
            }
        }
    `);

    // const { postItems } = await client().request(postItemsQuery);

    type postItems = {
        id: number;
        title: string;
        imageUrl: string | null;
        publicationDate: string;
    };

    const postItems = [
        {
            id: 1,
            title: "Syntax - Tasty Web Development Treats",
            // imageUrl: null,
            imageUrl: "https://megaphone.imgix.net/podcasts/5197fe5a-42f7-11f0-affd-87d9985a1760/image/c86a54acd72683732c4773e25bf0ae14.png?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
            publicationDate: "2026-06-01T11:00:00.000Z",
        },
        {
            id: 2,
            imageUrl:
                "https://static-cdn.sr.se/images/2519/53582c25-5165-432c-a16f-6b51b964d269.jpg?preset=api-itunes-presentation-image",
            title: "P3 Dokumentär",
            publicationDate: "2026-06-01T11:00:00.000Z",
        },
    ] satisfies postItems[];

    return (
        <main>
            <h1>Welcome to the Audio Player App</h1>
            <p>
                Explore your music collection with our sleek and intuitive audio
                player.
            </p>
            {postItems &&
                postItems.map((postItem) => (
                    <Card
                        key={postItem.id}
                        id={postItem.id}
                        imageUrl={postItem.imageUrl}
                        title={postItem.title}
                        publicationDate={postItem.publicationDate}
                    />
                ))}
        </main>
    );
}
