import AbstractClassWithSubscribe from './AbstractClassWithSubscribe';
import TimeVector2 from './VectorTouch';
export default class Touch extends AbstractClassWithSubscribe<"MOVE" | "END", TimeVector2> {
    id: string;
    type: 'TOUCH' | 'MOUSE';
    private _finished;
    positions: TimeVector2[];
    constructor(id: string, type: 'TOUCH' | 'MOUSE', firstPosition: TimeVector2);
    move(newPoint: TimeVector2, end?: boolean): void;
    readonly firstPosition: TimeVector2;
    readonly start: number;
    readonly finished: boolean;
}
