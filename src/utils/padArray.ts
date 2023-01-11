interface IPadArrayOptions<T> {
    padWith: T | T[];
    length: number;
    isCropped?: boolean;
}

export function padArray<T>(array: T[], { padWith, length, isCropped: crop }: IPadArrayOptions<T>): T[] {
    return Array(crop === false ? Math.max(length, array.length) : Math.max(length, 0))
        .fill(null)
        .map((_, i) => array[i] || (Array.isArray(padWith) ? padWith[(i - array.length) % padWith.length] : padWith));
}

/**
 * TODO: Anotate bot IPadArrayOptions and padArray
 * TODO: breakup into files
 */
