import { BoundingBox, Transformation, Vector } from 'xyzt';

import { DrawController } from './drawController/CanvasParticlesRenderer';
import { Grid } from './Grid';
import { Awaitable } from './interfaces/Awaitable';
import { IElement } from './interfaces/IElement';
import { IEvent } from './interfaces/IEvent';
import { IListener } from './interfaces/IListener';
import { ITouchController } from './interfaces/ITouchController';
import { MouseListener } from './listeners/MouseListener';
import { TouchListener } from './listeners/TouchListener';
import { MultiTouchController } from './MultiTouchController';
import { multiTouchTransformations } from './multiTouchTransformations';
import { Plugins } from './plugins';
import { Touch } from './Touch';
import { TouchController } from './TouchController';
import { DebugLayer } from './utils/DebugLayer';
import { EventManager } from './utils/EventManager';

import { GridTouchController } from './GridTouchController';

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
    ITouchController,
    GridTouchController,

     Awaitable ,
IElement ,
 IEvent,
 IListener,
    Transformation, // Note: exporting also Transformation from external library due to Vector is esential
    BoundingBox, // Note: exporting also BoundingBox from external library due to Vector is esential
    Vector, // Note: exporting also Vector from external library due to Vector is esential
};
