import Vector2 from './Vector2';

export class TouchFrame {
    public position: Vector2;

    constructor(
        public element: HTMLElement,
        public anchorElement: HTMLElement,
        public positionRelative: Vector2 = Vector2.Zero(),
        public time: number = performance.now(),
        public rotating: boolean = false,
        public force: number = 0,
        public radius: Vector2 = Vector2.Zero(),
    ) {
        const offset = Vector2.fromTopLeft(
            element.getBoundingClientRect(),
        ).subtractInPlace(
            Vector2.fromTopLeft(anchorElement.getBoundingClientRect()),
        );
        this.position = this.positionRelative.add(offset);
    }

    clone(): TouchFrame {
        return new TouchFrame(
            this.element,
            this.anchorElement,
            this.positionRelative,
            this.time,
            this.rotating,
            this.force,
            this.radius,
        );
    }
}
