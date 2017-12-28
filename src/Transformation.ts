import Vector2 from './Vector2';

export default class Transformation {
    constructor(public translate: Vector2,
                public rotate: number,
                public scale: number) {

    }

    static Zero(): Transformation {
        return new Transformation(
            Vector2.Zero(),
            0,
            1
        );
    }

    clone(): Transformation {
        return new Transformation(
            this.translate.clone(),
            this.rotate,
            this.scale
        );
    }

    add(transformation: Transformation): Transformation {
        return new Transformation(
            this.translate.add(transformation.translate),
            (this.rotate + transformation.rotate),//todo % (Math.PI * 2),
            this.scale * transformation.scale,
        );
    }

    subtract(transformation: Transformation): Transformation {
        return new Transformation(
            this.translate.subtract(transformation.translate),
            (this.rotate - transformation.rotate /*+ (Math.PI * 2)*/),//todo % (Math.PI * 2),
            this.scale / transformation.scale,
        );
    }
}