import { Vector2 } from './../Vector2';
import { Scene } from './Scene';
import { Particle, IParticleOptions } from './Particle';
export class CanvasParticlesRenderer {
    private liveCtx: CanvasRenderingContext2D;
    private deadCtx: CanvasRenderingContext2D;
    public deadParticlesCount = 0;
    private scene: Scene;

    constructor(quality: Vector2) {
        {
            const canvas = document.createElement('canvas');
            canvas.width = quality.x;
            canvas.height = quality.y;
            this.liveCtx = canvas.getContext('2d')!;
        }
        {
            const canvas = document.createElement('canvas');
            canvas.width = quality.x;
            canvas.height = quality.y;
            this.deadCtx = canvas.getContext('2d')!;
            this.deadCtx.fillStyle = '#ffffff';
            this.deadCtx.fillRect(
                0,
                0,
                this.deadCtx.canvas.width,
                this.deadCtx.canvas.height,
            );
        }

        this.scene = new Scene(this.liveCtx);

        //todo maybe with run?
        requestAnimationFrame((now) => this.render(now));
    }

    private _contexts: CanvasRenderingContext2D[] = [];
    addContext(context: CanvasRenderingContext2D) {
        this._contexts.push(context);
    }

    private _subscribers: (() => void)[] = [];
    subscribe(callback: () => void) {
        this._subscribers.push(callback);
    }
    private callSubscribers() {
        for (const subscriber of this._subscribers) {
            subscriber();
        }
    }

    addPoint(options: IParticleOptions) {
        const particle = new Particle(options, 1); //todo particle zIndex
        this.scene.addObject(particle);
    }

    get liveParticlesCount(): number {
        return this.scene.particles.length;
    }

    private lastRenderNow: null | number = null;
    private render(now: number) {
        //this.liveCtx.fillRect(0, 0, this.liveCtx.canvas.width, this.liveCtx.canvas.height);

        if (this.lastRenderNow) {
            const deadParticles = this.scene.update(
                (now - this.lastRenderNow) / 1000,
            );
            this.deadParticlesCount += deadParticles.length;
            for (const object of deadParticles.sort(Particle.compare)) {
                object.render(this.deadCtx);
            }
        }
        this.lastRenderNow = now;

        this.liveCtx.drawImage(this.deadCtx.canvas, 0, 0);
        this.scene.render();

        for (const ctx of this._contexts) {
            //ctx.fillRect(0, 0, this.liveCtx.canvas.width, this.liveCtx.canvas.height);
            ctx.drawImage(
                this.liveCtx.canvas,
                0,
                0,
                this.liveCtx.canvas.width,
                this.liveCtx.canvas.height,
                0,
                0,
                ctx.canvas.width,
                ctx.canvas.height,
            );
        }

        this.callSubscribers();
        requestAnimationFrame((now) => this.render(now));
    }
}
