"use client";
import { createContext, useContext, useState } from "react";
import { AudioContextType, AudioTrack } from "@/types/Audio";

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
    const [queue, setQueue] = useState<AudioTrack[]>([]);

    return (
        <AudioContext.Provider
            value={{
                currentTrack,
                queue,
                addToQueue: (track) => setQueue((prev) => [track, ...prev]),
                updateQueue: (newQueue) => setQueue(newQueue),
                deleteFromQueue: (trackId) => {
                    setQueue((prev) =>
                        prev.filter((track) => track.id !== trackId),
                    );
                },
                setCurrentTrack: (track) => {
                    setCurrentTrack(track);
                },
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
