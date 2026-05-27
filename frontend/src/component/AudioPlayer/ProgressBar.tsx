type ProgressBarProps = {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
};

function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);

        const formattedHours =
            hours > 0 ? `${hours.toString().padStart(2, "0")}:` : "";
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = seconds.toString().padStart(2, "0");

        return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
    };

    return (
        <div className="progress-bar">
            <span>
                {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(event) => onSeek(parseFloat(event.target.value))}
            />
        </div>
    );
}

export default ProgressBar;
