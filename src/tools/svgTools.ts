import Vector2 from "../Vector2";

export function vectorToTranslate(vector: Vector2) {
    return `translate(${vector.x},${vector.y})`;
}

export function translateToVector(translate = 'translate(0,0)') {
    //todo better and safer implementation
    const inner = translate.split('translate(')[1].split(')')[0];
    const [x, y] = inner.split(/,|\s+/);
    //console.log(inner,x,y);
    return new Vector2(parseFloat(x), parseFloat(y));
}