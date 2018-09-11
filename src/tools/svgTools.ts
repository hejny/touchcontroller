import Vector2 from '../Vector2';

export function vectorToTranslate(vector: Vector2) {
    return `translate(${vector.x},${vector.y})`;
}

export function translateToVector(translate = 'translate(0,0)') {
    const inner = translate.split('translate(')[1].split(')')[0];
    const [x, y] = inner.split(/,|\s+/);
    return new Vector2(parseFloat(x), parseFloat(y));
}

type TTranslate = [number,number]|null;
type TRotate = [number,number,number]|null;

export class svgTransform{

    static TRANSLATE = /^translate\(\s*(\-?\d+)\s(\-?\d+)\s(\-?\d+)\s*\)$/g; 

    static fromString(transform:string){

        let translate:TTranslate = null;
        let rotate:TRotate = null; 

        transform.split(' ').map((part)=>{

            if(this.TRANSLATE.test(part)){

                translate = [1,1,1];

            }else{
                throw new Error(`Unknown part of svg transform "part".`);
            }


        })
    }

    constructor(private translate:TTranslate,private rotate:TRotate){
    }

    toString{

    }

}


export function modifySvgTransform(type:'translate|rotate',addTo:number[]){




}