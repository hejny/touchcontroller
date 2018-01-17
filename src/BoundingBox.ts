import Vector2 from './Vector2';
import Transformation from './Transformation';

export default class BoundingBox {
    constructor(public center: Vector2 = Vector2.Zero(),
                public size: Vector2 = Vector2.One(),
                public rotation: number = 0) {}

    static One(){
        return new BoundingBox();
    }

    clone() {
        return new BoundingBox(
            this.center,
            this.size,
            this.rotation
        );
    }

    cloneDeep() {
        return new BoundingBox(
            this.center.clone(),
            this.size.clone(),
            this.rotation
        );
    }

    applyTransformation(transformation: Transformation){
        this.center.addInPlace(transformation.translate);
        this.size.scaleInPlace(transformation.scale);
        this.rotation += transformation.rotate;
    }

    intersects(position: Vector2):boolean{

        const position1r = this.center;
        const position2r = position.rotate(-this.rotation,this.center);

        return (
            position1r.x - this.size.x/2 <= position2r.x &&
            position1r.y - this.size.y/2 <= position2r.y &&
            position1r.x + this.size.x/2 >= position2r.x &&
            position1r.y + this.size.y/2 >= position2r.y
        );
    }

    /*
    todo
    collide(boundingBox2: BoundingBox):boolean{
    }*/
}