import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import TimeVector2 from './VectorTouch';
export default class Touche extends AbstractClassWithSubscribe<"MOVE" | "END", TimeVector2> {
    id: string;
    type: 'TOUCH' | 'MOUSE';
    private _finished;
    points: TimeVector2[];
    constructor(id: string, type: 'TOUCH' | 'MOUSE', firstPoint: TimeVector2);
    move(newPoint: TimeVector2, end?: boolean): void;
    readonly firstPoint: TimeVector2;
    readonly start: number;
    readonly finished: boolean;
}
