import Card from "@/component/Card";
import { client, graphql } from "@/gql";
import { cardFragment } from "@/gql/querry/PostItem";

export default async function Home() {
    const postItemsQuery = graphql(
        `
            query {
                websites(first: 20) {
                    nodes {
                        ...cardDitals
                    }
                }
            }
        `,
        [cardFragment],
    );

    const { websites } = await client().request(postItemsQuery);

    return (
        <main>
            <h1>Welcome to the Audio Player App</h1>
            <p>
                Explore your music collection with our sleek and intuitive audio
                player.
            </p>

            {websites?.nodes &&
                websites.nodes.map((postItem, index) => (
                    <Card key={index} postItem={postItem} />
                ))}
        </main>
    );
}
