
export function sign(x: number): 0 | -1 | 1 {
    if (x === 0) {
        return 0;
    } else if (x > 0) {
        return 1;
    } else if (x < 0) {
        return -1;
    } else {
        return 0;
    }
}


/**
 * TODO: Use native
 */