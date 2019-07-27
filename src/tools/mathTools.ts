// TODO: maybe with polyfill
export function sign(x: number): number {
    if (x === 0) return 0;
    if (x > 0) return 1;
    if (x < 0) return -1;
    return NaN;
}
