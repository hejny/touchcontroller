// GENERATED WITH generate-main-exports
// Warning: Do not edit by hand, all changes will be lost on next execution!

import { MultitouchControllerDebugLayer } from './debug/MultitouchControllerDebugLayer';
import { TouchControllerDebugLayer } from './debug/TouchControllerDebugLayer';
import { DrawController } from './drawController/CanvasParticlesRenderer';
import { IParticleOptions } from './drawController/Particle';
import { IParticleOptionsExternals } from './drawController/Particle';
import { Particle } from './drawController/Particle';
import { Scene } from './drawController/Scene';
import { emulateTouch } from './emulate/emulateTouch';
import { IEmulateTouchOptions } from './emulate/IEmulateTouchOptions';
import { IEmulateTouchOptionsAdvanced } from './emulate/IEmulateTouchOptions';
import { IAwaitable } from './interfaces/IAwaitable';
import { IDestroyable } from './interfaces/IDestroyable';
import { IElement } from './interfaces/IElement';
import { IElementListeners } from './interfaces/IElement';
import { IListener } from './interfaces/IListener';
import { ITouchController } from './interfaces/ITouchController';
import { MouseListener } from './listeners/MouseListener';
import { TouchListener } from './listeners/TouchListener';
import { Multitouch } from './multitouch/Multitouch';
import { MultitouchController } from './multitouch/MultitouchController';
import { IMultitouchTransformsOptions } from './multitouch/multitouchTransforms/multitouchTransforms';
import { multitouchTransforms } from './multitouch/multitouchTransforms/multitouchTransforms';
import { multitouchTransformsOnElement } from './multitouch/multitouchTransforms/multitouchTransformsOnElement';
import { Touch } from './touch/Touch';
import { TouchController } from './touch/TouchController';
import { TouchFrame } from './touch/TouchFrame';
import { TAverageItems } from './utils/average';
import { average } from './utils/average';
import { VectorAverage } from './utils/average';
import { particleOptionsAverage } from './utils/average';
import { SourceCache } from './utils/Cache';
import { CanvasRectangle } from './utils/CanvasRectangle';
import { EventManager } from './utils/EventManager';
import { getBoundingClientRectEnhanced } from './utils/getBoundingClientRectEnhanced';
import { createImageFromSrc } from './utils/imageTools';
import { createCanvasFromSrc } from './utils/imageTools';
import { createColoredCanvasFromSrc } from './utils/imageTools';
import { sign } from './utils/mathTools';
import { Omit } from './utils/Omit';
import { padArray } from './utils/padArray';
import { WithOptional } from './utils/WithOptional';

export {
    Omit,
    sign,
    Touch,
    Scene,
    average,
    padArray,
    IElement,
    Particle,
    IListener,
    TouchFrame,
    Multitouch,
    IAwaitable,
    SourceCache,
    WithOptional,
    EventManager,
    IDestroyable,
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
    MultitouchControllerDebugLayer,
};
