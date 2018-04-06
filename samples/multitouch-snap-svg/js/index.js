console.log(`initializePlaygrounds declared`);
function initializePlaygrounds(){

    for(const svgElement of document.querySelectorAll('svg[data-playground]')){

        const playgroundData = JSON.parse(svgElement.getAttribute('data-playground'));

        if(!playgroundData._initialized){

            console.log(`Initializing new playground`,svgElement);
            
            if(playgroundData.debug)svgElement.style.border = '1px solid red';
            //svgElement.style.position = 'fixed';
            //svgElement.style.top = '0px';
            //svgElement.style.left = '0px';

            
            svgElement.setAttribute('width',document.body.clientWidth-200);
            svgElement.setAttribute('height',document.body.clientHeight-200);

            const canvas = document.createElement('canvas');
            svgElement.parentNode.appendChild(canvas);

            /**/
            
            svgElementBoundingBox = svgElement.getBoundingClientRect();

            console.log('svgElementBoundingBox',svgElementBoundingBox);


            if(playgroundData.debug)canvas.style.border = '1px solid green';
            canvas.style.position = 'fixed';
            canvas.style.top = (svgElementBoundingBox.top)+'px';
            canvas.style.left = svgElementBoundingBox.left+'px';
            canvas.width = svgElementBoundingBox.width;
            canvas.height = svgElementBoundingBox.height;
            /**/

            const playground = new Playground(
                [
                    svgElement
                ],
                canvas,//document.getElementById('environment-trains'),
                playgroundData.debug?canvas:undefined  
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