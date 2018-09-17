import { Transformation } from '../Transformation';
import { Vector2 } from '../Vector2';

const TRANSFORM = /\w*\([^)]*\)/g
//todo is (\-?\d*\.?\d+) correct for number?
const TRANSLATE = /^translate\(\s*(\-?\d*\.?\d+)\s*,?\s*(\-?\d*\.?\d+)\s*\)$/g;
const ROTATE = /^rotate\(\s*(\-?\d*\.?\d+)\s*,?\s*(\-?\d*\.?\d+)\s*,?\s*(\-?\d*\.?\d+)\s*\)$/g;

//todo rotate(1.00342672343173e-7,0,0)





//console.log(TRANSLATE.exec('translate(4,84)'));
//console.log(TRANSLATE.exec('translate(4,84)'));


export function svgTransformationDecode(transform: string): Transformation {
    let transformation = Transformation.Neutral();

    TRANSFORM.lastIndex = 0;
    const transforms = TRANSFORM.exec(transform);

    if(!transforms){
        console.warn(`Can not decode svg transform "${transform}".`);
        return Transformation.Neutral();
    }

    transforms.map((part) => {

        TRANSLATE.lastIndex = 0;
        ROTATE.lastIndex = 0;
        

        if (TRANSLATE.test(part)) {
            //console.log(part, TRANSLATE);
            //console.log(part.match(TRANSLATE));

            TRANSLATE.lastIndex = 0;
            const [full, x, y] = TRANSLATE.exec(part)!.map((n) =>
                parseFloat(n),
            );
            full;

            transformation.translate = new Vector2(x, y);
        } else if (ROTATE.test(part)) {

            ROTATE.lastIndex = 0;
            const [full, angleDegrees, x, y] = ROTATE.exec(part)!.map((n) =>
                parseFloat(n),
            );
            full;

            transformation.rotate = (angleDegrees / 180) * Math.PI;
            transformation.rotateCenter = new Vector2(x, y);
        } else {
            
            console.warn(`Unknown part of svg transform "${part}".`,
            TRANSLATE.test(part),
            ROTATE.test(part)
        
        );


        }
    });

    return transformation;
}

export function svgTransformationEncode(
    transformation: Transformation,
): string {
    const { translate, rotate } = transformation;
    return `translate(${translate.x} ${translate.y}) rotate(${rotate} 0 0)`;//todo with spaces or colons?
}
