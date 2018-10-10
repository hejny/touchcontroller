import { Vector2 } from './../Vector2';
import { IParticleOptions } from '../drawController/Particle';
export declare type TAverageItems<T> = {
    value: T;
    weight: number;
}[];
export declare function average<T>(add: (a: T, b: T) => T, multiply: (a: T, b: number) => T, items: TAverageItems<T>): T;
export declare function vector2Average(...items: TAverageItems<Vector2>): Vector2;
export declare function particleOptionsAverage(...items: TAverageItems<IParticleOptions>): IParticleOptions;
