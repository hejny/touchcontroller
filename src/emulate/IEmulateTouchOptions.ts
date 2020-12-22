import { IVector } from 'xyzt';

export type IEmulateTouchOptions = IEmulateTouchFrame | IEmulateTouchOptionsAdvanced;
export interface IEmulateTouchOptionsAdvanced {
    frames: IEmulateTouchFrame[];
}
interface IEmulateTouchFrame {
    position: IVector;
}
