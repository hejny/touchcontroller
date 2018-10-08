import { Vector2 } from './../Vector2';
import { Particle } from './Particle';

export class Scene {
    //private ctx: CanvasRenderingContext2D;
    public particles: Particle[];

    constructor(private ctx: CanvasRenderingContext2D) {
        //const { width, height } = sceneElement.getBoundingClientRect();
        //sceneElement.width = width;
        //sceneElement.height = height;
        //this.ctx = sceneElement.getContext('2d')!;
        this.particles = [];
    }

    addObject(object: Particle) {
        this.particles.push(object);
    }

    render() {
        //this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (const particle of this.particles.sort(Particle.compare)) {
            particle.render(this.ctx);
        }
    }

    update(delta: number) {
        for (const object of this.particles) {
            //console.log(object.position,object.movement);
            object.update(delta);
        }

        const live: Particle[] = [];
        const dead: Particle[] = [];

        for (const particle of this.particles) {
            if (particle.live) {
                live.push(particle);
            } else {
                dead.push(particle);
            }
        }

        this.particles = live;
        return dead;
    }

    get size() {
        return new Vector2(this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
