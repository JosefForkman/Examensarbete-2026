interface SourceListProps {
    sources: string[];
    currentSource: number;
}

function SourceList({ sources, currentSource }: SourceListProps) {
    return (
        <ul>
            {sources.map((source, index) => (
                <li key={index}>
                    {index == currentSource ? "*" : ""}
                    {source}
                </li>
            ))}
        </ul>
    );
}

export default SourceList;
