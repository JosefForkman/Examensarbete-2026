export const volumeControlStates = {
    OFF: 0,
    MUTE: 1,
    LOW: 2,
    MEDIUM: 3,
    HIGH: 4,
} as const;

export type volumeControlStates =
    (typeof volumeControlStates)[keyof typeof volumeControlStates];
