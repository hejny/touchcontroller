import { ITransform } from 'xyzt';

export interface IBoundingBox {
    transform: ITransform;
    applyTransform(transform: ITransform): void;
}
