import { BoundingBox } from './BoundingBox';
import { DrawController } from './drawController/CanvasParticlesRenderer';
import { MouseListener } from './listeners/MouseListener';
import { TouchListener } from './listeners/TouchListener';
import { MultiTouchController } from './MultiTouchController';
import { multiTouchTransformations } from './multiTouchTransformations';
import { Plugins } from './plugins/index';
import { Touch } from './Touch';
import { TouchController } from './TouchController';
import { Transformation } from './Transformation';
import { DebugLayer } from './utils/DebugLayer';
import { EventManager } from './utils/EventManager';
import {
    svgTransformationDecode,
    svgTransformationEncode,
} from './utils/svgTools';


const listeners = {
    MouseListener,
    TouchListener,
};

// TODO: Export some usefull utils
// TODO: Maybe rename to index

export {
    TouchController,
    MultiTouchController,
    DebugLayer,
    multiTouchTransformations,
    Transformation,
    Touch,
    BoundingBox,
    listeners,
    svgTransformationDecode,
    svgTransformationEncode,
    DrawController,
    EventManager,
    Plugins,
};
