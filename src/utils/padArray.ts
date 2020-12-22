interface IPadArrayOptions<T> {
    padWith: T | T[];
    length: number;
    crop?: boolean;
}

export function padArray<T>(array: T[], { padWith, length, crop }: IPadArrayOptions<T>): T[] {
    return Array(crop === false ? Math.max(length, array.length) : Math.max(length, 0))
        .fill(null)
        .map((_, i) => array[i] || (Array.isArray(padWith) ? padWith[(i - array.length) % padWith.length] : padWith));
}
