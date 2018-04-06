function initializePlaygrounds(){

    for(const svgElement of document.querySelectorAll('svg[data-playground]')){

        const playgroundData = JSON.parse(svgElement.getAttribute('data-playground'));

        if(!playgroundData._initialized){
            


            const canvas = document.createElement('canvas');
            svgElement.parentNode.appendChild(canvas);

            svgElementBoundingBox = svgElement.getBoundingClientRect();

            console.log(document.body.scrollTop);
            canvas.style.border = '1px solid green';
            canvas.style.position = 'absolute';
            canvas.style.top = (svgElementBoundingBox.top-document.body.scrollTop)+'px';
            canvas.style.left = svgElementBoundingBox.left+'px';
            canvas.width = svgElementBoundingBox.width;
            canvas.height = svgElementBoundingBox.height;

            //svgElement.style.opacity = 0.1;


            const playground = new Playground(
                [
                    svgElement
                ],
                canvas,//document.getElementById('environment-trains'),
                playgroundData.debug||false?canvas:undefined  
            );







            playgroundData._initialized = true;
            svgElement.setAttribute('data-playground',JSON.stringify(playgroundData))
        }
    }
}

window.initializePlaygrounds = initializePlaygrounds;
/*
const debugLayerElement = document.getElementById('debug-layer');

debugLayerElement.width = document.body.clientWidth;
debugLayerElement.height = document.body.clientHeight;

const playground = new Playground(
    [
        document.getElementById('environment-trains'),
        document.getElementById('environment-cubes')
    ],
    document.body,//document.getElementById('environment-trains'),
    debugLayerElement    
);
    */