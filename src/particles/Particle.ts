import { Vector2 } from './../Vector2';

export class Particle {
    private image: HTMLImageElement;
    public movement: Vector2;
    public rotationMovement: number;
    public growth: number;
    public lifetime: number;

    constructor(
        src: string,
        public center: Vector2,
        public zIndex: number,
        public position: Vector2,
        public rotation: number,
        public width: number,
    ) {
        this.image = window.document.createElement('IMG') as HTMLImageElement;
        this.image.src = src;
        this.movement = Vector2.Zero();
        this.rotationMovement = 0;
        this.growth = 0;
        this.lifetime = -1;
    }

    get size() {
        return new Vector2(
            this.width,
            (this.width / this.image.width) * this.image.height,
        );
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation + Math.PI / 2);
        ctx.globalAlpha =
            this.lifetime === -1 ? 1 : Math.sqrt(this.lifetime / 10);
        ctx.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            -this.size.x * this.center.x,
            -this.size.y * this.center.y,
            this.size.x,
            this.size.y,
        );
        ctx.restore();
    }
}
