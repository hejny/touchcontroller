import Vector2 from './Vector2';

export default class Transformation {
    constructor(
        public translate: Vector2 = Vector2.Zero(),
        public rotate: number = 0,
        public scale: number = 1,
    ) {}

    static Zero(): Transformation {
        return new Transformation();
    }

    static translate(translate: Vector2): Transformation {
        return new Transformation(translate);
    }

    static rotate(rotate: number): Transformation {
        return new Transformation(undefined, rotate);
    }

    static scale(scale: number): Transformation {
        return new Transformation(undefined, undefined, scale);
    }

    clone(): Transformation {
        return new Transformation(this.translate, this.rotate, this.scale);
    }

    cloneDeep(): Transformation {
        return new Transformation(
            this.translate.clone(),
            this.rotate,
            this.scale,
        );
    }

    add(transformation: Transformation): Transformation {
        return new Transformation(
            this.translate.add(transformation.translate),
            (this.rotate + transformation.rotate) % (Math.PI * 2),
            this.scale * transformation.scale,
        );
    }

    subtract(transformation: Transformation): Transformation {
        return new Transformation(
            this.translate.subtract(transformation.translate),
            (this.rotate - transformation.rotate + Math.PI * 2) % (Math.PI * 2),
            this.scale / transformation.scale,
        );
    }

    /*nest(transformation: Transformation, center: Vector2 = Vector2.Zero()): Transformation {
        return new Transformation(
            this.translate.add(
                transformation.translate
                    .subtract(center)
                    .scale(this.scale)
                    //.rotate(this.rotate, this.translate.subtract(center).scale(this.scale))
                    //.subtract(center)
            ),
            (this.rotate + transformation.rotate) % (Math.PI * 2),
            this.scale * transformation.scale,
        );
    }*/
}
