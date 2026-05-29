"use client";
import { useRef, useState } from "react";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import AudioControls from "./AudioControls";
import { volumeControlStates } from "@/types/AudioPlayer";
import ProgressBar from "./ProgressBar";
import SourceList from "./SourceList";
import VolumeControl from "./VolumeControl";
import { useAudio } from "@/context/AudioContext";
import Button from "../Button";

import styles from "./AudioPlayer.module.css";

function AudioPlayer() {
    const [open, setOpen] = useState(false);

    const { queue, currentTrack, setCurrentTrack } = useAudio();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [volumeState, setVolumeState] = useState<volumeControlStates>(
        volumeControlStates.HIGH,
    );

    const currentIndex = queue.findIndex(
        (track) => track.id === currentTrack?.id,
    );
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < queue.length - 1;

    const toggleOpen = () => {
        setOpen((prev) => !prev);
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio || audio.src === "") {
            return;
        }
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
            return;
        }
        audio.play();
        setIsPlaying(true);
    };
    const onVolumeChange = () => {
        const audio = audioRef.current;
        if (!audio) {
            return;
        }

        console.log("Volume begin chance");

        if (audio.muted) {
            return;
        }

        const volumeLevel = audio.volume;

        if (volumeLevel === 0) {
            setVolumeState(volumeControlStates.MUTE);
        } else if (volumeLevel > 0 && volumeLevel <= 0.33) {
            setVolumeState(volumeControlStates.LOW);
        } else if (volumeLevel > 0.33 && volumeLevel <= 0.66) {
            setVolumeState(volumeControlStates.MEDIUM);
        } else {
            setVolumeState(volumeControlStates.HIGH);
        }
    };
    const onTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio) {
            return;
        }
        setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {
        const audio = audioRef.current;
        if (!audio) {
            return;
        }
        setDuration(audio.duration);
    };

    const nextAudioSource = () => {
        if (queue.length === 1) {
            setCurrentTrack(queue[0]);
        }

        setCurrentTrack(queue[currentIndex + 1]);

        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
    };
    const previousAudioSource = () => {
        if (queue.length === 1) {
            setCurrentTrack(queue[0]);
        }
        setCurrentTrack(queue[currentIndex - 1]);

        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
    };

    const handleSeek = (time: number) => {
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const handleVolumeChange = (volumeLevel: number) => {
        setVolume(volumeLevel);
        if (audioRef.current) {
            audioRef.current.volume = volumeLevel;
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) {
            return;
        }
        if (audioRef.current.muted) {
            setVolumeState(() => volumeControlStates.HIGH);
        } else {
            setVolumeState(() => volumeControlStates.OFF);
        }
    };

    return (
        <div
            className={`${styles.audioPlayerContainer} ${open ? styles.open : ""} bg-charcoal-blue`}>
            <audio
                src={currentTrack?.url}
                title={currentTrack?.title}
                // controls
                ref={audioRef}
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={onTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onVolumeChange={onVolumeChange}
                muted={volumeState === volumeControlStates.OFF}>
                Your browser does not support the audio element.
            </audio>

            <Button
                className={styles.toggleButton}
                Variant="IconOnly"
                Icon={open ? faChevronUp : faChevronDown}
                onClick={toggleOpen}
            />
            <div className={styles.trackInfo}>
                <h2>{currentTrack?.title ?? "Ingen podd tillgänglig"}</h2>
                <h3>{currentTrack?.artist}</h3>
            </div>

            {/* <SourceList sources={queue} currentSource={currentTrack} /> */}

            <AudioControls
                currentTime={currentTime}
                duration={duration}
                isPlaying={isPlaying}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onTogglePlay={togglePlay}
                onNext={nextAudioSource}
                onPrevious={previousAudioSource}
            />

            <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
            />

            <VolumeControl
                volume={volume}
                volumeState={volumeState}
                onVolumeChange={handleVolumeChange}
                onToggleMute={toggleMute}
            />
        </div>
    );
}

export default AudioPlayer;
