import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons/faVolumeHigh";
import { volumeControlStates } from "@/types/AudioPlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMedium } from "@fortawesome/free-solid-svg-icons/faVolumeMedium";
import { faVolumeLow } from "@fortawesome/free-solid-svg-icons/faVolumeLow";
import { faVolumeMute } from "@fortawesome/free-solid-svg-icons/faVolumeMute";

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
    return (
        <div className="volume-control">
            <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={volume}
                onChange={(event) =>
                    onVolumeChange(parseFloat(event.target.value))
                }
            />
            <button onClick={onToggleMute}>
                {volumeState === volumeControlStates.HIGH ? (
                    <FontAwesomeIcon icon={faVolumeHigh} />
                ) : volumeState === volumeControlStates.MEDIUM ? (
                    <FontAwesomeIcon icon={faVolumeMedium} />
                ) : volumeState === volumeControlStates.LOW ? (
                    <FontAwesomeIcon icon={faVolumeLow} />
                ) : (
                    <FontAwesomeIcon icon={faVolumeMute} />
                )}
            </button>
        </div>
    );
}

export default VolumeControl;
