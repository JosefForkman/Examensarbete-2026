import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons/faVolumeHigh";
import { volumeControlStates } from "@/types/AudioPlayer";
import Button from "../Button";
import {
    faVolumeLow,
    faVolumeMedium,
    faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./AudioPlayer.module.css";

type VolumeControlProps = {
    volume: number;
    volumeState: volumeControlStates;
    onVolumeChange: (volume: number) => void;
    onToggleMute: () => void;
};

function VolumeControl({
    volume,
    volumeState,
    onVolumeChange,
    onToggleMute,
}: VolumeControlProps) {
    const getVolumeIcon = () => {
        switch (volumeState) {
            case volumeControlStates.HIGH:
                return faVolumeHigh;
            case volumeControlStates.MEDIUM:
                return faVolumeMedium;
            case volumeControlStates.LOW:
                return faVolumeLow;
            case volumeControlStates.MUTE:
                return faVolumeMute;
            case volumeControlStates.OFF:
                return faVolumeMute;
            default:
                return faVolumeMute;
        }
    };

    return (
        <div className={styles.VolumeControl}>
            <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                aria-label="Volume Control"
                value={volume}
                onChange={(event) =>
                    onVolumeChange(parseFloat(event.target.value))
                }
            />
            <Button
                Icon={getVolumeIcon()}
                Variant="IconOnly"
                Size="2x"
                aria-label="Toggle Mute"
                onClick={onToggleMute}
            />
        </div>
    );
}

export default VolumeControl;
