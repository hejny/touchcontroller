import { MultiTouchController } from './../MultiTouchController';
const CSS_PREFIX = `touchcontroller-debug-layer-`;

export class DebugLayer {
    constructor(multiTouchController: MultiTouchController<any>) {
        createDebugLayerCss();

        const logElement = document.createElement('div');
        logElement.classList.add(`${CSS_PREFIX}main`);
        document.body.appendChild(logElement);

        multiTouchController.multiTouches.subscribe((multitouch) => {
            //const color = '#' + Math.floor(Math.random() * 16777215).toString(16);

            const logMultitouchElement = document.createElement('div');

            logMultitouchElement.innerHTML =
                `<div class="${CSS_PREFIX}multitouch"><div class="${CSS_PREFIX}title">` +
                multitouch +
                `</div><div class="${CSS_PREFIX}multitouch-last-transformation"></div></div>`;

            const logMultitouchLastTransformationElement = logMultitouchElement.querySelector(
                `.${CSS_PREFIX}multitouch-last-transformation`,
            ) as HTMLDivElement;

            logElement.appendChild(logMultitouchElement);

            multitouch.transformations().subscribe((transformation) => {
                logMultitouchLastTransformationElement.innerHTML = `
                        <table>
                            <tr>
                                <th>Translate:</th>
                                <td>${transformation.translate}</td>
                            </tr>
                            <tr>
                                <th>Rotate:</th>
                                <td>${transformation.rotate}</td>
                            </tr>
                            <tr>
                                <th>Scale:</th>
                                <td>${transformation.scale}</td>
                            </tr>
                        </table>
                    `;
            });

            multitouch.touches.subscribe(
                (touch) => {
                    const logTouchElement = document.createElement('div');

                    logTouchElement.innerHTML =
                        `<div class="${CSS_PREFIX}touch"><div class="${CSS_PREFIX}title">` +
                        touch +
                        `</div><div class="${CSS_PREFIX}touch-frames"></div><div class="${CSS_PREFIX}touch-last-frame"></div></div></div>`;
                    const logTouchFramesElement = logTouchElement.querySelector(
                        `.${CSS_PREFIX}touch-frames`,
                    ) as HTMLDivElement;
                    const logTouchLastFrameElement = logTouchElement.querySelector(
                        `.${CSS_PREFIX}touch-last-frame`,
                    ) as HTMLDivElement;

                    logMultitouchElement.appendChild(logTouchElement);

                    let framesCounter = 0;

                    touch.frames.subscribe(
                        (frame) => {
                            logTouchFramesElement.innerText = (framesCounter++).toString();

                            logTouchLastFrameElement.innerHTML = `
                        <table>
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
                        () => {},
                        () => {
                            logTouchElement.remove();
                        },
                    );
                },
                () => {},
                () => {
                    logMultitouchElement.remove();
                },
            );
        });
    }
}

function createDebugLayerCss() {
    const debugLayerCssElement = document.createElement('style');

    debugLayerCssElement.innerHTML =
        //todo context
        `
    .${CSS_PREFIX}main {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        
        z-index: 99999999;
    }
    
    .${CSS_PREFIX}title {
        background-color: bisque;
    }
    
    .${CSS_PREFIX}multitouch {
        border: 2px solid black;
    }
    
    .${CSS_PREFIX}touch {
        border: 2px solid black;
    }
    `;

    document.body.appendChild(debugLayerCssElement);
}
