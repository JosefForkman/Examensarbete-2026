"use client";
import { createContext, useContext, useState } from "react";
import z from "zod";

const AudioTrack = z.object({
    id: z.string(),
    title: z.string(),
    artist: z.string(),
    url: z.url(),
    provider: z.enum(["rss", "spotify", "youtube"]),
    durationInSeconds: z.number().default(0),
});

type AudioTrack = z.infer<typeof AudioTrack>;

const AudioContextType = z.object({
    currentTrack: AudioTrack.nullable(),
    queue: z.array(AudioTrack),
    isPlaying: z.boolean(),
    currentTime: z.number(),
    playTrack: z.function({ input: [AudioTrack], output: z.void() }),
    addToQueue: z.function({ input: [AudioTrack], output: z.void() }),
    togglePlay: z.function({ input: [], output: z.void() }),
    skipNext: z.function({ input: [], output: z.void() }),
});

type AudioContextType = z.infer<typeof AudioContextType>;

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
    const [queue, setQueue] = useState<AudioTrack[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    return (
        <AudioContext.Provider
            value={{
                currentTrack,
                queue,
                isPlaying,
                currentTime,
                playTrack: () => {},
                addToQueue: () => {},
                togglePlay: () => {},
                skipNext: () => {},
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
