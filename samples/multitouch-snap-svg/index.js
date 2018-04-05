
const sceneElement = document.getElementById('scene');
const svgElement = document.getElementById('svg');

sceneElement.width = document.body.clientWidth;
sceneElement.height = document.body.clientHeight;

const scene = new Scene(
    svgElement,
    sceneElement,
    sceneElement    
);
    
    
for(const groupElement of svgElement.querySelectorAll('g')){
    //console.log(g.getBoundingClientRect());
    
    const playground = JSON.parse(groupElement.getAttribute('data-playground'));
    
    console.log(playground);
    
    const boundingBox = groupElement.getBoundingClientRect();



    scene.addRect(
    new Rect(
        'red',
        playground,
        new TC.Vector2(
            (boundingBox.right+boundingBox.left)/2,
            (boundingBox.bottom+boundingBox.top)/2,
            ),
        new TC.Vector2(
            boundingBox.right-boundingBox.left,
            boundingBox.bottom-boundingBox.top,
        ),
        0,
        scene
    )
);



}