
export const _CSS_PREFIX = 'touchcontroller-debug-layer-';

export function _createDebugLayerCss():void {

    // TODO: Create only once

    const debugLayerCssElement = document.createElement('style');

    debugLayerCssElement.innerHTML =
        // TODO: context id
        `

    /*---------logs----------*/

    .${_CSS_PREFIX}main {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        
        z-index: 99999999;
    }
    
    .${_CSS_PREFIX}title {
        background-color: bisque;
    }
    
    .${_CSS_PREFIX}multitouch {
        border: 2px solid black;
        background-color: white;
    }

    .${_CSS_PREFIX}multitouch .touches {
        padding: 20px;
    }
    
    .${_CSS_PREFIX}touch {
        border: 2px solid black;
    }


    /*---------show in position----------*/

    .${_CSS_PREFIX}touch-show{
        pointer-events: none;
        position: absolute;
        width: 30px;
        height: 30px;
        border: 2px solid #cc3377;
        border-radius: 999px;
        /*transform: translate(-15px, -15px);*/
    }


    `;

    document.body.appendChild(debugLayerCssElement);
}
