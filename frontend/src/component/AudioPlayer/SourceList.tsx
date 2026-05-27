import { AudioTrack } from "@/types/Audio";

interface SourceListProps {
    sources: AudioTrack[];
    currentSource: AudioTrack | null;
}

function SourceList({ sources, currentSource }: SourceListProps) {
    return (
        <ul>
            {sources.map((source) => (
                <li key={source.id}>
                    {source.id === currentSource?.id ? "*" : ""}
                    {source.title} - {source.artist}
                </li>
            ))}
        </ul>
    );
}

export default SourceList;
