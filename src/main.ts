import { Vector } from 'xyzt';

import { BoundingBox } from './BoundingBox';
import { DrawController } from './drawController/CanvasParticlesRenderer';
import { Grid } from './Grid';
import { MouseListener } from './listeners/MouseListener';
import { TouchListener } from './listeners/TouchListener';
import { MultiTouchController } from './MultiTouchController';
import { multiTouchTransformations } from './multiTouchTransformations';
import { Plugins } from './plugins';
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
    Grid,
    Vector, // Note: exporting also vector from external library due to Vector is esential
};
