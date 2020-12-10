// GENERATED WITH generate-main-exports
// Warning: Do not edit by hand, all changes will be lost on next execution!

import { MultitouchControllerDebugLayer } from './debug/MultiTouchControllerDebugLayer';
import { TouchControllerDebugLayer } from './debug/TouchControllerDebugLayer';
import { DrawController } from './drawController/CanvasParticlesRenderer';
import { IParticleOptions, IParticleOptionsExternals, Particle } from './drawController/Particle';
import { Scene } from './drawController/Scene';
import { emulateTouch } from './emulate/emulateTouch';
import { IEmulateTouchOptions, IEmulateTouchOptionsAdvanced } from './emulate/IEmulateTouchOptions';
import { Awaitable } from './interfaces/Awaitable';
import { IElement, IElementListeners } from './interfaces/IElement';
import { IEvent } from './interfaces/IEvent';
import { IListener } from './interfaces/IListener';
import { ITouchController } from './interfaces/ITouchController';
import { MouseListener } from './listeners/MouseListener';
import { TouchListener } from './listeners/TouchListener';
import { Multitouch } from './multitouch/Multitouch';
import { MultitouchController } from './multitouch/MultitouchController';
import { IMultitouchTransformsOptions, multitouchTransforms } from './multitouch/multitouchTransforms/multitouchTransforms';
import { multitouchTransformsOnElement } from './multitouch/multitouchTransforms/multitouchTransformsOnElement';
import { Touch } from './touch/Touch';
import { TouchController } from './touch/TouchController';
import { TouchFrame } from './touch/TouchFrame';
import { average, particleOptionsAverage, TAverageItems, VectorAverage } from './utils/average';
import { SourceCache } from './utils/Cache';
import { CanvasRectangle } from './utils/CanvasRectangle';
import { EventManager } from './utils/EventManager';
import { getBoundingClientRectEnhanced } from './utils/getBoundingClientRectEnhanced';
import { createCanvasFromSrc, createColoredCanvasFromSrc, createImageFromSrc } from './utils/imageTools';
import { sign } from './utils/mathTools';
import { padArray } from './utils/padArray';

export {
    sign,
    Touch,
    Scene,
    IEvent,
    average,
    padArray,
    IElement,
    Particle,
    IListener,
    Awaitable,
    TouchFrame,
    Multitouch,
    SourceCache,
    EventManager,
    emulateTouch,
    VectorAverage,
    TAverageItems,
    TouchListener,
    MouseListener,
    DrawController,
    CanvasRectangle,
    TouchController,
    ITouchController,
    IParticleOptions,
    IElementListeners,
    createImageFromSrc,
    createCanvasFromSrc,
    multitouchTransforms,
    MultitouchController,
    IEmulateTouchOptions,
    particleOptionsAverage,
    IParticleOptionsExternals,
    TouchControllerDebugLayer,
    createColoredCanvasFromSrc,
    IMultitouchTransformsOptions,
    IEmulateTouchOptionsAdvanced,
    getBoundingClientRectEnhanced,
    multitouchTransformsOnElement,
    MultitouchControllerDebugLayer
};
