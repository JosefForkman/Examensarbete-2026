"use client";

import { useAudio } from "@/context/AudioContext";
import { AudioTrack } from "@/types/Audio";
import styles from "./Podcast.module.css";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Button from "@/component/Button";
import dayjs from "dayjs";
import "dayjs/locale/sv";
import relativeTime from "dayjs/plugin/relativeTime";
import { FragmentOf, readFragment } from "gql.tada";
import { postItems } from "@/gql/query/PodcastDetail";

dayjs.extend(relativeTime);
dayjs.locale("sv");

interface Episode {
    id: number;
    title: string;
    description: string | null;
    link: string;
    imageUrl: string | null;
    publicationDate: Date;
}

type EpisodeListProps = {
    episodes: FragmentOf<typeof postItems>;
    podcastName: string;
}

export default function EpisodeList({
    episodes,
    podcastName,
}: EpisodeListProps) {
    const { setCurrentTrack } = useAudio();

    const { nodes } = readFragment(postItems, episodes);

    const handlePlay = (episode: Episode) => {
        const track: AudioTrack = {
            id: episode.id,
            title: episode.title,
            artist: podcastName,
            url: episode.link,
            provider: "rss",
        };
        setCurrentTrack(track);
    };

    return (
        <div className={styles.episodeList}>
            <h2>Avsnitt</h2>
            {nodes &&
                nodes.map((episode) => (
                    <div key={episode.id} className={styles.episodeItem}>
                        <div className={styles.episodeInfo}>
                            <h3>{episode.title}</h3>
                            <span className={styles.episodeDate}>
                                {dayjs(episode.publicationDate).format(
                                    "D MMMM YYYY",
                                )}{" "}
                                • {dayjs().to(dayjs(episode.publicationDate))}
                            </span>
                        </div>
                        <Button
                            Variant="IconOnly"
                            Icon={faPlay}
                            onClick={() => handlePlay(episode)}
                        />
                    </div>
                ))}
        </div>
    );
}
