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

    public render(ctx: CanvasRenderingContext2D):void {
        ctx.save();
        ctx.beginPath();

        
        ctx.translate(
            ...this.center
                //.subtract(this.transform.scale.half())
                .toArray2D(),
        );

        ctx.rotate(this.transform.rotate.z);
       

        ctx.rect(this.size.x/-2, this.size.y/-2, this.size.x, this.size.y);
        ctx.fillStyle = this.options.color || '#ff0000';
        ctx.fill();
        if (this.options.hovered) {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        ctx.restore();
    }

    public applyTransform(transform: ITransform):void {

        //this.transform =  this.transform.apply(Transform.fromObject(transform));

        /**/
        // TODO: !!! TO xyzt
        const t1 = Transform.fromObject(transform);
        const t2 = this.transform;

        // TODO: !!! Transform.combine
        this.transform = Transform.fromObject({
            rotate: Vector.add(t1.rotate, t2.rotate),
            scale: Vector.multiply(t1.scale, t2.scale),
            translate: Vector.add(
                t1.translate,
                t2.translate
            ),
        });
        /* */

    }
}
