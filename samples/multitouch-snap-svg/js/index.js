
const debugLayerElement = document.getElementById('debug-layer');

debugLayerElement.width = document.body.clientWidth;
debugLayerElement.height = document.body.clientHeight;

const playground = new Playground(
    [
        document.getElementById('environment-trains'),
        document.getElementById('environment-cubes')
    ],
    debugLayerElement,
    debugLayerElement    
);
    