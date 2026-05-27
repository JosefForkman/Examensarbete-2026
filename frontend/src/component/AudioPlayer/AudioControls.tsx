import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBackwardStep,
    faClockRotateLeft,
    faForwardStep,
    faPause,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";

type AudioControlsProps = {
    isPlaying: boolean;
    onTogglePlay: () => void;
    onSkipForward: () => void;
    onSkipBackward: () => void;
    onNext: () => void;
    onPrevious: () => void;
};

function AudioControls({
    isPlaying,
    onTogglePlay,
    onSkipForward,
    onSkipBackward,
    onNext,
    onPrevious,
}: AudioControlsProps) {
    return (
        <div className="audio-controls">
            <button onClick={onPrevious}>
                <FontAwesomeIcon icon={faBackwardStep} />
            </button>
            <button onClick={onSkipBackward}>
                <FontAwesomeIcon icon={faClockRotateLeft} />
            </button>
            <button onClick={onTogglePlay}>
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
            <button onClick={onSkipForward}>
                <FontAwesomeIcon icon={faClockRotateLeft} />
            </button>
            <button onClick={onNext}>
                <FontAwesomeIcon icon={faForwardStep} />
            </button>
        </div>
    );
}

export default AudioControls;
