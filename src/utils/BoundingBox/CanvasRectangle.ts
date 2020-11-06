import { ITransform, Transform } from 'xyzt';
import { BoundingBox } from './BoundingBox';

interface ICanvasRectangleOptions {
    transform: ITransform;
    color?: string;
    hovered?: boolean;
}

export class CanvasRectangle extends BoundingBox {
    constructor(private options: ICanvasRectangleOptions) {
        super(Transform.fromObject(options.transform));
    }

    public render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();

        ctx.rotate(this.transform.rotate.z);
        ctx.translate(
            ...this.center
                .rotate(-this.rotation.z)
                .subtract(this.size.half())
                .toArray2D(),
        );
        ctx.rect(0, 0, this.size.x, this.size.y);
        ctx.fillStyle = this.options.color || '#ff0000';
        ctx.fill();
        if (this.options.hovered) {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        ctx.restore();
    }
}
