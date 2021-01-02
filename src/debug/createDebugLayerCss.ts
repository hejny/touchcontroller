export const _CSS_PREFIX = 'touchcontroller-debug-layer-';

export function _createDebugLayerCss(): void {
    // TODO: Create only once

    const debugLayerCssElement = document.createElement('style');

    debugLayerCssElement.innerHTML =
        // TODO: context id
        `

    /*---------logs----------*/

    .${_CSS_PREFIX}main {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        width: 40vw;
        overflow-x: hidden;
        overflow-y: scroll;
        /*resize: horizontal;*/

        border-left: 2px solid #555;

        z-index: 99999999;
    }
    
    .${_CSS_PREFIX}title {
        background-color: bisque;
        padding: 10px;
    }
    
    .${_CSS_PREFIX}multitouch {
        border-bottom: 2px solid #555;
        background-color: white;
    }

    .${_CSS_PREFIX}multitouch .touches {
        padding: 20px;
    }
    
    .${_CSS_PREFIX}touch {
        border: 2px solid #555;
    }


    /*---------show in position----------*/

    .${_CSS_PREFIX}touch-show{
        pointer-events: none;
        width: 30px;
        height: 30px;
        border: 2px solid #cc3377;
        border-radius: 999px;
        transform: translate(-15px, -15px);
    }

    .${_CSS_PREFIX}hovered{
        border: 2px solid #cccc00!important;
    }


    `;

    document.body.appendChild(debugLayerCssElement);
}
