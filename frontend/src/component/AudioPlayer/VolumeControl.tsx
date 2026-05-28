import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons/faVolumeHigh";
import { volumeControlStates } from "@/types/AudioPlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMedium } from "@fortawesome/free-solid-svg-icons/faVolumeMedium";
import { faVolumeLow } from "@fortawesome/free-solid-svg-icons/faVolumeLow";
import { faVolumeMute } from "@fortawesome/free-solid-svg-icons/faVolumeMute";
import Button from "../Button";

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
        <div className="volume-control">
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
                aria-label="Toggle Mute"
                onClick={onToggleMute}
            />
        </div>
    );
}

export default VolumeControl;
