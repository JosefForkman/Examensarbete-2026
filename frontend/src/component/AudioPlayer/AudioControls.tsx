import {
    faBackwardStep,
    faForwardStep,
    faPause,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";

type AudioControlsProps = {
    isPlaying: boolean;
    onTogglePlay: () => void;
    onNext: () => void;
    onPrevious: () => void;
};

function AudioControls({
    isPlaying,
    onTogglePlay,
    onNext,
    onPrevious,
}: AudioControlsProps) {
    return (
        <div className="audio-controls">
            <Button
                Icon={faBackwardStep}
                Variant="IconOnly"
                onClick={onPrevious}
            />
            <Button
                Variant="IconOnly"
                Icon={isPlaying ? faPause : faPlay}
                onClick={onTogglePlay}
            />
            <Button Icon={faForwardStep} Variant="IconOnly" onClick={onNext} />
        </div>
    );
}

export default AudioControls;
