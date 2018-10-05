import { Vector2 } from './../Vector2';
import { Scene } from './Scene';
import { Particle } from './Particle';
export class CanvasParticlesRenderer {

    private ctx: CanvasRenderingContext2D;
    private scene: Scene;

    constructor(quality: Vector2) {
        const canvas = document.createElement('canvas');
        console.log(quality)
        canvas.width = quality.x;
        canvas.height = quality.y;
        console.log(canvas);
        this.ctx = canvas.getContext('2d')!;
        console.log(this.ctx);
        console.log(this.ctx.canvas);
        this.scene = new Scene(this.ctx, 0.05); //todo depend this value

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
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        if (this.lastRenderNow)
            this.scene.update((now - this.lastRenderNow) / 1000);
        this.lastRenderNow = now;
        this.scene.render();
        
        //console.log(this.ctx.canvas);

        for (const ctx of this._contexts) {

            /*ctx.drawImage(
                this.ctx.canvas,
                0,
                0
            );*/

            //todo is canvas starting from 0,0 or 1,1
            ctx.drawImage(
                this.ctx.canvas,
                0,
                0,
                this.ctx.canvas.width,
                this.ctx.canvas.height,
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
