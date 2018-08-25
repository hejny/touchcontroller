import Vector2 from './Vector2';

export default class TouchFrame {

    public position: Vector2;

    constructor(
        public element: HTMLElement,
        public anchorElement: HTMLElement,
        public relativePosition: Vector2 = Vector2.Zero(),
        public time: number = performance.now(),
        public rotating: boolean = false,
        //public rotation: number = 0,
        //public scale: number = 1,
        public force: number = 0,
        public radius: Vector2 = Vector2.Zero(),
    ) {
            const offset = Vector2.fromTopLeft(
                element.getBoundingClientRect(),
            ).subtractInPlace(
                Vector2.fromTopLeft(
                    anchorElement.getBoundingClientRect(),
                ),
            );
            this.position = this.relativePosition.add(offset);
            //console.log('this.position',this.position);
    }

    clone():TouchFrame{
        return new TouchFrame(
            this.element,
            this.anchorElement,
            this.relativePosition,
            this.time,
            this.rotating,
            this.force,
            this.radius
        );
    }
}
