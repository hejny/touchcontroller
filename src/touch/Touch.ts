import { Subject } from 'rxjs/internal/Subject';
import * as uuid from 'uuid';
import { IElement } from '../interfaces/IElement';
import { TouchFrame } from './TouchFrame';


let id = 0;
export class Touch {
    /*
    TODO: Delete and make separate helpers for emulating Touch 
    public static Click(
        element: HTMLElement,
        anchorElement: HTMLElement,
        position: Vector,
    ): Touch {
        const touch = new Touch(
            'MOUSE',
            anchorElement,
            new TouchFrame(element, anchorElement, position),
        );
        window.setTimeout(() => {
            touch.frames.complete();
        }, 100);
        return touch;
    }
    */

    public readonly id = id++;
    public readonly uuid = uuid.v4();
    public frames = new Subject<TouchFrame>();
    public firstFrame: Promise<TouchFrame>;


    constructor(
        // TODO: options
        readonly type: 'TOUCH' | 'MOUSE' /* TODO: | 'EMULATED' */ , // TODO: maybe as second optional param and extendable
        readonly anchorElement: IElement,
        readonly buttonIdentifier?: string | number,
    ) {
        this.firstFrame = new Promise((resolve)=>{
            this.frames.subscribe((frame)=>{
                resolve(frame);
            });
        });
    }

    public frameTuples(framesPerTuple: number): Subject<TouchFrame[]>{
        // TODO: grouping options [1,2,3],[2,3,4] vs [1,2,3],[3,4,5] vs [1,2,3],[4,5,6]
        // Note: There is maybe a RxJS operator for this but I can not find it.

        const frameTuples = new Subject<TouchFrame[]/* TODO: Can I infer tuple type from number? */>();
        const tray: TouchFrame[] = [];
        this.frames.subscribe(
            (frame)=>{
                tray.push(frame);

                if(tray.length>framesPerTuple){
                    tray.shift();
                }
                if(tray.length===framesPerTuple){
                    frameTuples.next(tray);
                }
            },
            (error)=>frameTuples.error(error),
            ()=>frameTuples.complete()
        );
        return frameTuples;
    }

    public toString(): string {
        return `Touch ${this.id} ${
            this.buttonIdentifier
                ? `(external id is ${this.buttonIdentifier})`
                : ''
        }`;
    }

    /*
    // TODO: better name OR probbably delete
    public get start(): number {
        return this.firstFrame.time;
    }
    */

}
