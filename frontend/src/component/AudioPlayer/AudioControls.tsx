import {
    faBackwardStep,
    faForwardStep,
    faPause,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
import styles from "./AudioPlayer.module.css";

type AudioControlsProps = {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    onTogglePlay: () => void;
    onNext: () => void;
    onPrevious: () => void;
};

function AudioControls({
    isPlaying,
    onTogglePlay,
    onNext,
    onPrevious,
    currentTime,
    duration,
}: AudioControlsProps) {
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
        <div className={styles.AudioControls}>
            <div className={styles.buttonGroup}>
                <Button
                    Variant="IconOnly"
                    Size="2x"
                    Icon={faBackwardStep}
                    onClick={onPrevious}
                    disabled={currentTime < 5}
                />
                <Button
                    Variant="IconOnly"
                    Size="2x"
                    Icon={isPlaying ? faPause : faPlay}
                    onClick={onTogglePlay}
                />
                <Button
                    Variant="IconOnly"
                    Size="2x"
                    Icon={faForwardStep}
                    onClick={onNext}
                    disabled={currentTime >= duration - 5}
                />
            </div>
            <span>
                {formatTime(currentTime)} / {formatTime(duration)}
            </span>
        </div>
    );
}

export default AudioControls;
