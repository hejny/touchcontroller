import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import * as uuid from 'uuid';
import { IElement } from '../interfaces/IElement';
import { padArray } from '../utils/padArray';
import { WithOptional } from '../utils/WithOptional';
import { TouchFrame } from './TouchFrame';

interface ITouchOptions {
    type: 'TOUCH' | 'MOUSE' /* TODO: | 'EMULATED' */; // TODO: maybe as second optional param and extendable
    anchorElement: IElement;
    buttonIdentifier?: string | number;
    firstFrame: TouchFrame;
}

const touchOptionsDefault = {};

let id = 0;
export class Touch {
    public readonly type: 'TOUCH' | 'MOUSE';
    public readonly anchorElement: IElement;
    public readonly buttonIdentifier?: string | number;
    public readonly id = id++;
    public readonly uuid = uuid.v4(); // TODO: Do we really need uuid
    public readonly frames: BehaviorSubject<TouchFrame>;
    public readonly firstFrame: TouchFrame;

    /**
     *
     * @param anchorElement Positions of touch are relative to anchorElement
     */
    constructor(options: WithOptional<ITouchOptions, keyof typeof touchOptionsDefault>) {
        const { type, anchorElement, buttonIdentifier, firstFrame } = {
            ...touchOptionsDefault,
            ...options,
        };

        this.type = type;
        this.anchorElement = anchorElement;
        this.buttonIdentifier = buttonIdentifier;
        this.firstFrame = firstFrame;

        this.frames = new BehaviorSubject<TouchFrame>(firstFrame);
    }

    public frameTuples({ itemsPerTuple, startImmediately }: ITouchFrameTuplingOptions): Subject<TouchFrame[]> {
        // Note: There is maybe a RxJS operator for this but I can not find it.

        const frameTuples = new Subject<TouchFrame[] /* TODO: Can I infer tuple type from number? */>();
        const tray: TouchFrame[] = [];
        this.frames.subscribe({
            next: (frame) => {
                tray.push(frame);

                if (tray.length > itemsPerTuple) {
                    tray.shift();
                }
                if (tray.length === itemsPerTuple) {
                    frameTuples.next(tray);
                } else if (startImmediately) {
                    frameTuples.next(padArray(tray, { padWith: tray, length: itemsPerTuple }));
                }
            },
            error: (error) => frameTuples.error(error),
            complete: () => frameTuples.complete(),
        });
        return frameTuples;
    }

    public toString(): string {
        return `Touch ${this.id} ${this.buttonIdentifier ? `(external id is ${this.buttonIdentifier})` : ''}`;
    }

    // TODO: !!! Destoroy
    /*
    // TODO: better name OR probbably delete
    public get start(): number {
        return this.firstFrame.time;
    }
    */
}

interface ITouchFrameTuplingOptions {
    itemsPerTuple: number;
    startImmediately?: boolean;
    // TODO: grouping options [1,2,3],[2,3,4] vs [1,2,3],[3,4,5] vs [1,2,3],[4,5,6]
}
