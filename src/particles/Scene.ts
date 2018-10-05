import { Vector2 } from './../Vector2';
import { Particle } from './Particle';

export class Scene {
    //private ctx: CanvasRenderingContext2D;
    private particles: Particle[];

    constructor(private ctx: CanvasRenderingContext2D, private friction: number) {
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
        for (const object of this.particles.sort(Particle.compare)){
            object.render(this.ctx);
        }
    }

    update(delta: number) {
        for (const object of this.particles) {
            //console.log(object.position,object.movement);
            object.position.addInPlace(object.movement.scale(delta));
            object.rotation += object.rotationMovement;
            object.width += object.growth;

            const frictionWithDelta = Math.pow(this.friction, delta);
            object.movement.scaleInPlace(frictionWithDelta);
            object.rotationMovement *= frictionWithDelta;
            object.growth *= frictionWithDelta;
        }

        const live:Particle[] = [];
        const dead:Particle[] = [];

        for(const particle of this.particles){
            if(particle.live){
                live.push(particle);
            }else{
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
