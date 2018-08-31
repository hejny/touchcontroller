import Vector2 from '../Vector2';

interface ITransformObject{
    translate: Vector2;
    rotate: number;
}

export function objectToTranslate(transformObject: ITransformObject) {
    return `translate(${vector.x},${vector.y})`;
}

export function translateToObject(translate = 'translate(0,0)') {
    const inner = translate.split('translate(')[1].split(')')[0];
    const [x, y] = inner.split(/,|\s+/);
    return new Vector2(parseFloat(x), parseFloat(y));
}
