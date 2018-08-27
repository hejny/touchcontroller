//todo to other my library - combine TC, Vire
import Vector2 from './Vector2';
import Transformation from './Transformation';

export default class BoundingBox {
    constructor(
        public center: Vector2 = Vector2.Zero(),
        public size: Vector2 = Vector2.One(),
        public rotation: number = 0,
    ) {}

    static One() {
        return new BoundingBox();
    }

    static fromMinMax(
        maxx: number,
        maxy: number,
        minx: number,
        miny: number,
        rotation: number,
    ) {
        return new BoundingBox(
            new Vector2((maxx + minx) / 2, (maxy + miny) / 2),
            new Vector2(maxx - minx, maxy - miny),
            rotation,
        );
    }

    clone() {
        return new BoundingBox(this.center, this.size, this.rotation);
    }

    cloneDeep() {
        return new BoundingBox(
            this.center.clone(),
            this.size.clone(),
            this.rotation,
        );
    }

    applyTransformation(transformation: Transformation) {
        this.center.addInPlace(transformation.translate);
        this.size.scaleInPlace(transformation.scale);
        this.rotation += transformation.rotate;
    }

    intersects(position: Vector2): boolean {
        const position1r = this.center;
        const position2r = position.rotate(-this.rotation, this.center);

        return (
            position1r.x - this.size.x / 2 <= position2r.x &&
            position1r.y - this.size.y / 2 <= position2r.y &&
            position1r.x + this.size.x / 2 >= position2r.x &&
            position1r.y + this.size.y / 2 >= position2r.y
        );
    }

    grow(amount: number) {
        return new BoundingBox(
            this.center,
            new Vector2(this.size.x + amount * 2, this.size.y + amount * 2),
            this.rotation,
        );
    }

    rotate(radians = 0, position = this.center) {
        this.center = this.center.rotate(radians, position); //todo maybe in place
        this.rotation += radians;
    }

    isIn(outerBoard: BoundingBox) {
        return (
            outerBoard.intersects(this.topLeft) &&
            outerBoard.intersects(this.topRight) &&
            outerBoard.intersects(this.bottomLeft) &&
            outerBoard.intersects(this.bottomRight)
        );
    }

    get topLeft() {
        return this.center
            .add(new Vector2(this.size.x * -0.5, this.size.y * -0.5))
            .rotate(this.rotation, this.center);
    }

    get topRight() {
        return this.center
            .add(new Vector2(this.size.x * 0.5, this.size.y * -0.5))
            .rotate(this.rotation, this.center);
    }

    get bottomLeft() {
        return this.center
            .add(new Vector2(this.size.x * -0.5, this.size.y * 0.5))
            .rotate(this.rotation, this.center);
    }

    get bottomRight() {
        return this.center
            .add(new Vector2(this.size.x * 0.5, this.size.y * 0.5))
            .rotate(this.rotation, this.center);
    }

    set topLeft(value: Vector2) {
        this.center = this.center.add(value.subtract(this.topLeft));
    }

    countTransformation(destinationBoundingBox: BoundingBox) {
        return new Transformation(
            destinationBoundingBox.center.subtract(this.center),
            destinationBoundingBox.rotation - this.rotation,
            destinationBoundingBox.size.x / destinationBoundingBox.size.x, //todo better
        );
    }

    redrawToElement(boundingBoxElement: HTMLDivElement) {
        boundingBoxElement.style.display = 'block';
        boundingBoxElement.style.position = 'fixed';
        boundingBoxElement.style.zIndex = '9999';
        boundingBoxElement.style.border = '2px solid red';
        boundingBoxElement.style.left = this.center.x + 'px';
        boundingBoxElement.style.top = this.center.y + 'px';
        boundingBoxElement.style.width = this.size.x + 'px';
        boundingBoxElement.style.height = this.size.y + 'px';
        boundingBoxElement.style.transform = `translate(-50%, -50%) rotate(${(this
            .rotation /
            Math.PI) *
            180}deg)`;
    }

    /*
    todo
    collide(boundingBox2: BoundingBox):boolean{
    }*/
}
