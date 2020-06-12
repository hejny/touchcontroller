import { Vector } from 'xyzt';

import { IParticleOptions, IParticleOptionsExternals } from '../drawController/Particle';

export type TAverageItems<T> = Array<{ value: T; weight: number }>;

export function average<T>(
    add: (a: T, b: T) => T,
    multiply: (a: T, b: number) => T,
    items: TAverageItems<T>,
): T {
    let sum = 0;
    let count: null | T = null;
    for (const item of items) {
        sum += item.weight;
        const value = multiply(item.value, item.weight);
        count = !count ? value : add(count, value);
    }
    if (!count) {
        throw new Error(
            `There must be at least one item when counting average.`,
        );
    }
    if (sum <= 0) {
        throw new Error(`Sum of weights should be positive number.`);
    }
    return multiply(count, 1 / sum);
}

// TODO: not used
export function VectorAverage(...items: TAverageItems<Vector>) {
    return average<Vector>(
        (a, b) => Vector.add(a, b),
        (a, b) => a.scale(b),
        items,
    );
}

function particleOptionsExternalsAdd(
    a: IParticleOptionsExternals,
    b: IParticleOptionsExternals,
) {
    return {
        position: Vector.add(a.position, b.position),
        rotation: a.rotation + b.rotation,
        widthSize: a.widthSize + b.widthSize,
    };
}

function particleOptionsExternalsMultiply(
    a: IParticleOptionsExternals,
    b: number,
) {
    return {
        position: a.position.scale(b),
        rotation: a.rotation * b,
        widthSize: a.widthSize * b,
    };
}

export function particleOptionsAverage(
    ...items: TAverageItems<IParticleOptions>
) {
    return average<IParticleOptions>(
        (a, b) => ({
            shapeSrc: a.shapeSrc,
            shapeCenter: Vector.add(a.shapeCenter, b.shapeCenter),
            color: a.color, // TODO: with color
            current: particleOptionsExternalsAdd(a.current, b.current),
            movement: particleOptionsExternalsAdd(a.movement, b.movement),
            friction: a.friction + b.friction,
        }),
        (a, b) => ({
            shapeSrc: a.shapeSrc,
            shapeCenter: a.shapeCenter.scale(b),
            color: a.color, // TODO: with color
            current: particleOptionsExternalsMultiply(a.current, b),
            movement: particleOptionsExternalsMultiply(a.movement, b),
            friction: a.friction * b,
        }),
        items,
    );
}
