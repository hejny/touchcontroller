import Vector2 from './Vector2';

export default class TouchFrame{
    constructor(
                public position: Vector2,
                public time: number,
                public rotation: number = 0,
                public scale: number = 1,
                public force: number = 0,
                public radius: Vector2 = Vector2.Zero()
                ) {
    }
}