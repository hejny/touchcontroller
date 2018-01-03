import Vector2 from './Vector2';

export default class TouchFrame{
    constructor(
                public position: Vector2,
                public time: number,
                public radius: Vector2 = Vector2.Zero(),
                public rotation: Vector2 = Vector2.Zero(),
                public force: number = 0
                ) {
    }
}