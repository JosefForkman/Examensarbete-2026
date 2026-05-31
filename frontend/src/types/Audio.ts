import z from "zod";

export const AudioTrack = z.object({
    id: z.number().nonnegative(),
    title: z.string(),
    artist: z.string(),
    url: z.url(),
    provider: z.enum(["rss", "spotify", "youtube"]),
});

export type AudioTrack = z.infer<typeof AudioTrack>;

export const AudioContextType = z.object({
    currentTrack: AudioTrack.nullable(),
    queue: z.array(AudioTrack),
    addToQueue: z.function({ input: [AudioTrack], output: z.void() }),
    updateQueue: z.function({ input: [z.array(AudioTrack)], output: z.void() }),
    deleteFromQueue: z.function({
        input: [z.number().nonnegative()],
        output: z.void(),
    }),
    setCurrentTrack: z.function({ input: [AudioTrack], output: z.void() }),
});

export type AudioContextType = z.infer<typeof AudioContextType>;
