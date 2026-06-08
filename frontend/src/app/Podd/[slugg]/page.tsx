import { client, graphql } from "@/gql";
import Image from "next/image";
import styles from "./Podcast.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRss } from "@fortawesome/free-solid-svg-icons";
import EpisodeList from "./EpisodeList";
import { postItems, websites } from "@/gql/query/PodcastDetail";
import { readFragment } from "gql.tada";

type Props = {
    params: Promise<{ slugg: string }>;
};

export default async function Page({ params }: Props) {
    const { slugg } = await params;
    const podcastName = slugg.replaceAll("-", " ");

    const podcastDetailQuery = graphql(
        `
            query GetPodcastDetail($name: String!) {
                websites(where: { name: { eq: $name } }) {
                    ...website
                }
                postItems(
                    where: { websiteName: { eq: $name } }
                    order: [{ publicationDate: DESC }]
                ) {
                    ...post
                }
            }
        `,
        [postItems, websites],
    );

    const data = await client().request(podcastDetailQuery, {
        name: podcastName,
    });

    const websiteNodes = readFragment(websites, data.websites);
    const podcast = websiteNodes?.nodes?.[0];
    const episodes = data.postItems;

    if (!podcast || !episodes) {
        return (
            <main className={styles.container}>
                <h1>Podd hittades inte</h1>
                <p>Kunde inte hitta podden &quot;{podcastName}&quot;.</p>
            </main>
        );
    }

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                {podcast.imageUrl ? (
                    <Image
                        src={podcast.imageUrl}
                        alt={podcast.name}
                        width={240}
                        height={240}
                        className={styles.image}
                    />
                ) : (
                    <div className={styles.missingImage}>
                        <FontAwesomeIcon icon={faRss} size="5x" />
                    </div>
                )}
                <div className={styles.headerInfo}>
                    <h1>{podcast.name}</h1>
                    {podcast.description && (
                        <p className={styles.description}>
                            {podcast.description}
                        </p>
                    )}
                </div>
            </header>

            <EpisodeList episodes={episodes} podcastName={podcast.name} />
        </main>
    );
}
