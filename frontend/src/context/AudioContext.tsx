"use client";
import { createContext, useContext, useState } from "react";
import { AudioContextType, AudioTrack } from "@/types/Audio";

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
    const [queue, setQueue] = useState<AudioTrack[]>([]);

    const addToQueue = (track: AudioTrack) => {
        const isInQueue = queue.some(
            (queueTrack) => queueTrack.id === track.id,
        );

        // Set the track as the current track
        setCurrentTrack(track);

        // If the track is already in the queue, do nothing
        if (isInQueue) {
            return;
        }

        // Otherwise, add the track to the beginning of the queue
        setQueue((prev) => [track, ...prev]);
    };

    const selectTrack = (track: AudioTrack) => {
        // If the selected track is already the current track, do nothing
        if (currentTrack?.id === track.id) {
            return;
        }

        // Set the selected track as the current track from the queue
        setCurrentTrack(track);

        // Move the selected track to the queue if it's not already there
        const isInQueue = queue.some(
            (queueTrack) => queueTrack.id === track.id,
        );

        // If the track is already in the queue, do nothing
        if (isInQueue) {
            return;
        }

        // Otherwise, add the track to the beginning of the queue
        setQueue((prev) => [track, ...prev]);
    };

    return (
        <AudioContext.Provider
            value={{
                currentTrack,
                queue,
                addToQueue,
                updateQueue: (newQueue) => setQueue(newQueue),
                deleteFromQueue: (trackId) => {
                    setQueue((prev) =>
                        prev.filter((track) => track.id !== trackId),
                    );
                },
                setCurrentTrack: selectTrack,
            }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);

    const validateContext = AudioContextType.safeParse(context);

    if (!validateContext.success) {
        throw new Error(
            "AudioContext value is invalid or context is not within an AudioProvider",
        );
    }

    return validateContext.data;
};
