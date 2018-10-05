import { Vector2 } from './../Vector2';
import { Scene } from './Scene';
import { Particle } from './Particle';
export class CanvasParticlesRenderer {

    private liveCtx: CanvasRenderingContext2D;
    private deadCtx: CanvasRenderingContext2D;
    private scene: Scene;

    constructor(quality: Vector2) {

        {
            const canvas = document.createElement('canvas');
            canvas.width  = quality.x;
            canvas.height = quality.y;
            this.liveCtx = canvas.getContext('2d')!;
        }
        {
            const canvas = document.createElement('canvas');
            canvas.width  = quality.x;
            canvas.height = quality.y;
            this.deadCtx = canvas.getContext('2d')!;
            this.deadCtx.fillStyle = '#ffffff';
            this.deadCtx.fillRect(0, 0, this.deadCtx.canvas.width, this.deadCtx.canvas.height);
        }

        this.scene = new Scene(this.liveCtx, 0.05); //todo depend this value

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

    addPoint(position: Vector2) {
        const particle = new Particle(
            './particle.png', //todo depend this value
            new Vector2(0.5, 0.5), //todo depend this value
            1, //todo depend this value
            position,
            -Math.PI / 2,
            1,
        );
        particle.movement = new Vector2(
            (Math.random() - 0.5) * 10, //todo depend this value
            (Math.random() - 0.5) * 10,
        );
        particle.rotationMovement = ((Math.random() - 0.5) * Math.PI * 2) / 100; //todo depend this value
        particle.growth = 1;
        //particle.lifetime = 1;
        this.scene.addObject(particle);
    }

    private lastRenderNow: null | number = null;
    private render(now: number) {
        //this.liveCtx.fillRect(0, 0, this.liveCtx.canvas.width, this.liveCtx.canvas.height);


        if (this.lastRenderNow){
            const deadParticles = this.scene.update((now - this.lastRenderNow) / 1000);
            for (const object of deadParticles.sort(Particle.compare)){
                object.render(this.deadCtx);
                console.log(`rendring to dead ctx`);

            }
        }
        this.lastRenderNow = now;

        this.liveCtx.drawImage(this.deadCtx.canvas,0, 0);
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
