import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import TimeVector2 from './VectorTouch';
export default class Touche extends AbstractClassWithSubscribe<"MOVE" | "END", TimeVector2> {
    id: string;
    type: 'TOUCH' | 'MOUSE';
    points: TimeVector2[];
    private _finished;
    constructor(id: string, type: 'TOUCH' | 'MOUSE', points?: TimeVector2[]);
    move(newPoint: TimeVector2, end?: boolean): void;
    readonly start: number;
    readonly finished: boolean;
}
