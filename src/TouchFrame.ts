import Vector2 from './Vector2';

export default class TouchFrame{
    constructor(
                public position: Vector2 = Vector2.Zero(),
                public time: number = performance.now(),
                public rotation: number = 0,
                public scale: number = 1,
                public force: number = 0,
                public radius: Vector2 = Vector2.Zero()
                ) {
    }
}