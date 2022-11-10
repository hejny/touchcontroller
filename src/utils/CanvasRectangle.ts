import { BoundingBox, ITransform, Transform, Vector } from 'xyzt';

interface ICanvasRectangleOptions {
    transform: ITransform;
    color?: string;
    hovered?: boolean;
}

export class CanvasRectangle extends BoundingBox {
    constructor(public readonly options: ICanvasRectangleOptions) {
        super(Transform.fromObject(options.transform));
    }

    public render(ctx: CanvasRenderingContext2D, transform: Transform): void {
        ctx.save();
        ctx.beginPath();

        transform = this.transform.apply(transform);

        ctx.translate(...transform.translate.toArray2D());

        ctx.rotate(transform.rotate.z);

        ctx.rect(transform.scale.x / -2, transform.scale.y / -2, transform.scale.x, transform.scale.y);
        ctx.fillStyle = this.options.color || '#ff0000';
        ctx.fill();
        if (this.options.hovered) {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        ctx.restore();
    }

    public applyTransform(transform: ITransform): void {
        //this.transform =  this.transform.apply(Transform.fromObject(transform));

        /**/
        // TODO: !! TO xyzt
        const t1 = Transform.fromObject(transform);
        const t2 = this.transform;

        // TODO: !! Transform.combine
        this.transform = Transform.fromObject({
            rotate: Vector.add(t1.rotate, t2.rotate),
            scale: Vector.multiply(t1.scale, t2.scale),
            translate: Vector.add(t1.translate, t2.translate),
        });
        /* */
    }
}

/**
 * TODO: Anotate
 * TODO: breakup into files
 * TODO: Write tests
 */
