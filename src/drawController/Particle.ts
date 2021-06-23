import { Destroyable, IDestroyable } from 'destroyable';
import { Vector } from 'xyzt';
import { createColoredCanvasFromSrc } from '../utils/imageTools';
import { sign } from '../utils/mathTools';

export interface IParticleOptions {
    shapeSrc: string;
    shapeCenter: Vector;
    color: string;
    current: IParticleOptionsExternals;
    movement: IParticleOptionsExternals;
    friction: number;
}

export interface IParticleOptionsExternals {
    position: Vector;
    rotation: number;
    widthSize: number;
}

export class Particle extends Destroyable implements IDestroyable {
    public static compare(a: Particle, b: Particle): 0 | -1 | 1 {
        return sign(a.zIndex - b.zIndex);
    }

    private shapeData: null | HTMLImageElement | HTMLCanvasElement = null;

    constructor(private readonly options: IParticleOptions, public zIndex: number) {
        super();
        this.initializeSource();
    }

    public async initializeSource(): Promise<void> {
        this.shapeData = await createColoredCanvasFromSrc(this.options.shapeSrc, this.options.color); // TODO: optimize image loads
    }

    public get size(): Vector {
        if (!this.shapeData) {
            // TODO: maybe only warn and return width,width
            throw new Error('Particle image is not yet loaded.');
        }

        return Vector.fromArray(
            this.options.current.widthSize,
            (this.options.current.widthSize / this.shapeData.width) * this.shapeData.height,
        );
    }

    public get live(): boolean {
        // TODO: tresshold in config
        return (
            this.options.movement.position.distance() > 0.5 ||
            this.options.movement.rotation > 0.5 ||
            this.options.movement.widthSize > 0.5
        );
    }

    public update(delta: number): void {
        this.options.current.position.add(this.options.movement.position.scale(delta));
        this.options.current.rotation += this.options.movement.rotation * delta;
        this.options.current.widthSize += this.options.movement.widthSize * delta;

        const frictionPowered = Math.pow(this.options.friction, delta);
        this.options.movement.position.scale(frictionPowered);
        this.options.movement.rotation *= frictionPowered;
        this.options.movement.widthSize *= frictionPowered; // TODO: maybe as area
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.shapeData) {
            // TODO: maybe console.warn(`Particle image is not yet loaded.`);
            return;
        }

        ctx.save();
        ctx.translate(this.options.current.position.x, this.options.current.position.y);
        ctx.rotate(this.options.current.rotation + Math.PI / 2);
        // ctx.globalAlpha = this.lifetime === -1 ? 1 : Math.sqrt(this.lifetime / 10);
        ctx.drawImage(
            this.shapeData,
            0,
            0,
            this.shapeData.width,
            this.shapeData.height,
            -this.size.x * this.options.shapeCenter.x,
            -this.size.y * this.options.shapeCenter.y,
            this.size.x,
            this.size.y,
        );
        ctx.restore();
    }

    public async destroy(): Promise<void> {
        super.destroy();
        // TODO: Implement and really destroy things constructed and created here
        // TODO: Use in methods this.checkWhetherNotDestroyed
    }
}
