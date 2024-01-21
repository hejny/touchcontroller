// GENERATED WITH generate-main-exports
// Warning: Do not edit by hand, all changes will be lost on next execution!

import { MultitouchControllerDebugLayer } from './debug/MultiTouchControllerDebugLayer';
import { TouchControllerDebugLayer } from './debug/TouchControllerDebugLayer';
import { DrawController } from './drawController/CanvasParticlesRenderer';
import { IParticleOptions, IParticleOptionsExternals, Particle } from './drawController/Particle';
import { Scene } from './drawController/Scene';
import { emulateTouch } from './emulate/emulateTouch';
import { IEmulateTouchOptions, IEmulateTouchOptionsAdvanced } from './emulate/IEmulateTouchOptions';
import { IElement, IElementListeners } from './interfaces/IElement';
import { IListener } from './interfaces/IListener';
import { ITouchController } from './interfaces/ITouchController';
import { MouseListener } from './listeners/MouseListener';
import { TouchListener } from './listeners/TouchListener';
import { Multitouch } from './multitouch/Multitouch';
import { MultitouchController } from './multitouch/MultitouchController';
import {
    IMultitouchTransformsOptions,
    multitouchTransforms
} from './multitouch/multitouchTransforms/multitouchTransforms';
import { multitouchTransformsOnElement } from './multitouch/multitouchTransforms/multitouchTransformsOnElement';
import { Touch } from './touch/Touch';
import { TouchController } from './touch/TouchController';
import { TouchFrame } from './touch/TouchFrame';
import { average, particleOptionsAverage, TAverageItems, VectorAverage } from './utils/average';
import { SourceCache } from './utils/Cache';
import { CanvasRectangle } from './utils/CanvasRectangle';
import { DomTouch } from './utils/DomTouch';
import { EventManager } from './utils/EventManager';
import { getBoundingClientRectEnhanced } from './utils/getBoundingClientRectEnhanced';
import { createCanvasFromSrc, createColoredCanvasFromSrc, createImageFromSrc } from './utils/imageTools';
import { sign } from './utils/mathTools';
import { Omit } from './utils/Omit';
import { padArray } from './utils/padArray';
import { WithOptional } from './utils/WithOptional';

export {
    average,
    CanvasRectangle,
    createCanvasFromSrc,
    createColoredCanvasFromSrc,
    createImageFromSrc,
    DomTouch,
    DrawController,
    emulateTouch,
    EventManager,
    getBoundingClientRectEnhanced,
    IElement,
    IElementListeners,
    IEmulateTouchOptions,
    IEmulateTouchOptionsAdvanced,
    IListener,
    IMultitouchTransformsOptions,
    IParticleOptions,
    IParticleOptionsExternals,
    ITouchController,
    MouseListener,
    Multitouch,
    MultitouchController,
    MultitouchControllerDebugLayer,
    multitouchTransforms,
    multitouchTransformsOnElement,
    Omit,
    padArray,
    Particle,
    particleOptionsAverage,
    Scene,
    sign,
    SourceCache,
    TAverageItems,
    Touch,
    TouchController,
    TouchControllerDebugLayer,
    TouchFrame,
    TouchListener,
    VectorAverage,
    WithOptional,
};
