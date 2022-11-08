import { Destroyable, IDestroyable } from 'destroyable';
import { MultitouchController } from '../multitouch/MultitouchController';
import { multitouchTransformsOnElement } from '../multitouch/multitouchTransforms/multitouchTransformsOnElement';
import { Touch } from '../touch/Touch';
import { _createDebugLayerCss, _CSS_PREFIX } from './createDebugLayerCss';

export class MultitouchControllerDebugLayer extends Destroyable implements IDestroyable {
    constructor(multitouchController: MultitouchController<any>) {
        super();
        _createDebugLayerCss();

        const touchElements = new WeakMap<Touch, HTMLDivElement>();

        const logElement = document.createElement('div');
        logElement.classList.add(`${_CSS_PREFIX}main`);
        document.body.appendChild(logElement);

        multitouchController.multitouches.subscribe({
            next: (multitouch) => {
                // const color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

                const logMultitouchElement = document.createElement('div');

                logMultitouchElement.innerHTML = `
            <div class="${_CSS_PREFIX}multitouch">
                <div class="${_CSS_PREFIX}title">${multitouch.toString()}</div>
                <div class="${_CSS_PREFIX}multitouch-last-transform"></div>
                <div class="touches"></div>
            </div>
            `;

                const logMultitouchLastTransformElement = logMultitouchElement.querySelector(
                    `.${_CSS_PREFIX}multitouch-last-transform`,
                ) as HTMLDivElement;

                logElement.appendChild(logMultitouchElement);

                multitouchTransformsOnElement({ multitouch, touchController: null as any /* !!! */ }).subscribe(
                    (transform) => {
                        logMultitouchLastTransformElement.innerHTML = `
                        <table>
                            <tr>
                                <th>Translate:</th>
                                <td>${transform.translate}</td>
                            </tr>
                            <tr>
                                <th>Rotate:</th>
                                <td>${transform.rotate}</td>
                            </tr>
                            <tr>
                                <th>Scale:</th>
                                <td>${transform.scale}</td>
                            </tr>
                        </table>
                    `;
                    },
                );

                multitouch.touches.subscribe({
                    next: (touch) => {
                        logMultitouchElement.querySelector('.touches')!.appendChild(touchElements.get(touch)!);
                    },
                    complete: () => {
                        logElement.removeChild(logMultitouchElement);
                    },
                });
            },
        });

        multitouchController.touchController.touches.subscribe({
            next: (touch) => {
                console.log({ touch });
                const logTouchElement = document.createElement('div');
                touchElements.set(touch, logTouchElement);

                logTouchElement.innerHTML = `
                    <div class="${_CSS_PREFIX}touch">
                        <div class="${_CSS_PREFIX}title">${touch.toString()}</div>
                        <div class="${_CSS_PREFIX}touch-frames-count"></div>
                        <div class="${_CSS_PREFIX}touch-last-frame"></div>
                    </div>
                    `;
                const logTouchFramesCountElement = logTouchElement.querySelector(
                    `.${_CSS_PREFIX}touch-frames-count`,
                ) as HTMLDivElement;
                const logTouchLastFrameElement = logTouchElement.querySelector(
                    `.${_CSS_PREFIX}touch-last-frame`,
                ) as HTMLDivElement;

                let framesCounter = 0;

                touch.frames.subscribe({
                    next: (frame) => {
                        // console.log({ frame });

                        logTouchFramesCountElement.innerText = (framesCounter++).toString();

                        logTouchLastFrameElement.innerHTML = `
                        <table>
                            <tr>
                                <th colspan="2">Touch</th>
                            </tr>
                            <tr>
                                <th>ID:</th>
                                <td>${touch.id}</td>
                            </tr>
                            <tr>
                                <th>Type:</th>
                                <td>${touch.type}</td>
                            </tr>
                            <tr>
                                <th>UUID:</th>
                                <td>${touch.uuid}</td>
                            </tr>
                            <tr>
                                <th>ButtonIdentifier:</th>
                                <td>${touch.buttonIdentifier}</td>
                            </tr>
                            <tr>
                                <th colspan="2">Current frame</th>
                            </tr>
                            <tr>
                                <th>Position:</th>
                                <td>${frame.position}</td>
                            </tr>
                            <tr>
                                <th>Time:</th>
                                <td>${frame.time}</td>
                            </tr>
                            <tr>
                                <th>Force:</th>
                                <td>${frame.force}</td>
                            </tr>
                            <tr>
                                <th>Radius:</th>
                                <td>${frame.radius}</td>
                            </tr>
                        </table>
                `;
                        /*
                        <tr>
                            <th>Rotation:</th>
                            <td>${frame.rotation}</td>
                        </tr>
                        <tr>
                            <th>Scale:</th>
                            <td>${frame.scale}</td>
                        </tr>
                        */
                    },
                    complete: () => {
                        logTouchElement.remove();
                    },
                });
            },
            complete: () => {
                //logMultitouchElement.remove();
            },
        });
    }

    public async destroy(): Promise<void> {
        super.destroy();
        // TODO: Implement and really destroy things constructed and created here
        // TODO: Use in methods this.checkWhetherNotDestroyed
    }
}
