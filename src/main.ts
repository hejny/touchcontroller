import { BoundingBox, Transformation, Vector } from 'xyzt';

import { DrawController } from './drawController/CanvasParticlesRenderer';
import { Grid } from './Grid';
import { MouseListener } from './listeners/MouseListener';
import { TouchListener } from './listeners/TouchListener';
import { MultiTouchController } from './MultiTouchController';
import { multiTouchTransformations } from './multiTouchTransformations';
import { Plugins } from './plugins';
import { Touch } from './Touch';
import { TouchController } from './TouchController';
import { DebugLayer } from './utils/DebugLayer';
import { EventManager } from './utils/EventManager';

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
    Touch,
    listeners,
    DrawController,
    EventManager,
    Plugins,
    Grid,
    Transformation, // Note: exporting also Transformation from external library due to Vector is esential
    BoundingBox, // Note: exporting also BoundingBox from external library due to Vector is esential
    Vector, // Note: exporting also Vector from external library due to Vector is esential
};
