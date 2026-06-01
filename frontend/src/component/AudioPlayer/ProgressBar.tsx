import styles from "./AudioPlayer.module.css";
type ProgressBarProps = {
    currentTime: number;
    duration: number;
    onSeek: (time: number) => void;
};

function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
    return (
        <div className={styles.ProgressBar}>
            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                disabled={duration === 0}
                onChange={(event) => onSeek(parseFloat(event.target.value))}
            />
        </div>
    );
}

export default ProgressBar;
