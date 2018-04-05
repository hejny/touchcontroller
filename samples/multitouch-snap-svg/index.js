
const sceneElement = document.getElementById('scene');
const svgElement = document.getElementById('svg');

sceneElement.width = document.body.clientWidth;
sceneElement.height = document.body.clientHeight;

const scene = new Scene(
    svgElement,
    sceneElement,
    sceneElement    
);
    
    
for(const g of svgElement.querySelectorAll('g')){
    console.log(g.getBoundingClientRect());


    scene.addRect(
    new Rect(
        'red',
        true,
        new TC.Vector2(720, 300),
        new TC.Vector2(200, 200),
        0,
        scene
    )
);



}