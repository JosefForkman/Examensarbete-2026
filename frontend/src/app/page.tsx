import Card from "@/component/Card";
import { client, graphql } from "@/gql";
import { cardFragment } from "@/gql/query/PostItem";

export default async function Home() {
    const postItemsQuery = graphql(
        `
            query {
                websites(first: 20) {
                    edges {
                        node {
                            ...cardDitals
                        }
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

            {websites.edges &&
                websites.edges.map((edge, index) => (
                    <Card key={index} postItem={edge.node} />
                ))}
        </main>
    );
}
