import { Subject } from 'rxjs/internal/Subject';
import * as uuid from 'uuid';
import { IElement } from '../interfaces/IElement';
import { padArray } from '../utils/padArray';
import { TouchFrame } from './TouchFrame';


let id = 0;
export class Touch {
    public readonly id = id++;
    public readonly uuid = uuid.v4();
    public readonly frames = new Subject<TouchFrame>();
    public readonly firstFrame: Promise<TouchFrame>;


    constructor(
        // TODO: options
        public readonly type: 'TOUCH' | 'MOUSE' /* TODO: | 'EMULATED' */ , // TODO: maybe as second optional param and extendable
        public readonly anchorElement: IElement,
        public readonly buttonIdentifier?: string | number,
    ) {
        this.firstFrame = new Promise((resolve)=>{
            this.frames.subscribe((frame)=>{
                resolve(frame);
            });
        });
    }

    public frameTuples({itemsPerTuple,startImmediately}: ITouchFrameTuplingOptions): Subject<TouchFrame[]>{
        
        // Note: There is maybe a RxJS operator for this but I can not find it.

        const frameTuples = new Subject<TouchFrame[]/* TODO: Can I infer tuple type from number? */>();
        const tray: TouchFrame[] = [];
        this.frames.subscribe({
            next: (frame)=>{
                tray.push(frame);

                if(tray.length>itemsPerTuple){
                    tray.shift();
                }
                if(tray.length===itemsPerTuple){
                    frameTuples.next(tray);
                }else
                if(startImmediately){
                    frameTuples.next(padArray(tray,{padWith:tray, length: itemsPerTuple}));
                }
            },
            error: (error)=>frameTuples.error(error),
            complete: ()=>frameTuples.complete()
        });
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


interface ITouchFrameTuplingOptions{
    itemsPerTuple: number;
    startImmediately?: boolean;
    // TODO: grouping options [1,2,3],[2,3,4] vs [1,2,3],[3,4,5] vs [1,2,3],[4,5,6]
}