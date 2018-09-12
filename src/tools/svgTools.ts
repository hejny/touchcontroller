import { Transformation } from "../Transformation";

const TRANSLATE = /^translate\(\s*(\-?\d+)\s*(\-?\d+)\s*\)$/g; 
const ROTATE = /^rotate\(\s*(\-?\d+)\s*(\-?\d+)\s*(\-?\d+)\s*\)$/g; 



function svgTransformationDecode(transform:string):Transformation{

        let transformation = Transformation.Neutral();

        transform.split(' ').map((part)=>{

            if(this.TRANSLATE.test(part)){

                const [x,y] = part.match(this.TRANSLATE)!.map((n)=>parseFloat(n));
                transformation.translate = new Vector2(x,y);

            }else
            if(this.ROTATE.test(part)){

                const [angleDegrees,x,y] = part.match(this.ROTATE)!.map((n)=>parseFloat(n));

                transformation.rotate = angleDegrees/180*Math.PI;
                transformation.roteteCenter = new Vector2(x,y);

            }else{
                throw new Error(`Unknown part of svg transform "${part}".`);
            }


        })
}

function svgTransformationEncode(transformation:Transformation):string{
    const {translate,rotate} = transformation;
    return `translate(${translate.x} ${translate.y}) rotate(${rotate} 0 0)`;
}



export function modifySvgTransform(type:'translate|rotate',addTo:number[]){




}