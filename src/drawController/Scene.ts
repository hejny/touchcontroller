import { Destroyable, IDestroyable } from 'destroyable';
import { Vector } from 'xyzt';
import { Particle } from './Particle';

export class Scene extends Destroyable implements IDestroyable {
    // private ctx: CanvasRenderingContext2D;
    public particles: Particle[];

    constructor(private readonly ctx: CanvasRenderingContext2D) {
        super();
        // const { width, height } = sceneElement.getBoundingClientRect();
        // sceneElement.width = width;
        // sceneElement.height = height;
        // this.ctx = sceneElement.getContext('2d')!;
        this.particles = [];
    }

    public addObject(object: Particle): void {
        this.particles.push(object);
    }

    public render(): void {
        // this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (const particle of this.particles.sort(Particle.compare)) {
            particle.render(this.ctx);
        }
    }

    public update(delta: number): Particle[] {
        for (const object of this.particles) {
            // console.log(object.position,object.movement);
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

    public get size(): Vector {
        return Vector.fromArray(this.ctx.canvas.width, this.ctx.canvas.height);
    }

    public async destroy(): Promise<void> {
        super.destroy();
        // TODO: Implement and really destroy things constructed and created here
        // TODO: Use in methods this.checkWhetherNotDestroyed
    }
}
