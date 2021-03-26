import { IAwaitable } from '../IAwaitable';

export interface IDestroyable {
    readonly destroyed: boolean;
    destroy(): IAwaitable<void>;
}
