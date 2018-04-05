class Rect extends TC.BoundingBox {
    constructor(color, svgElement, center, size, rotation = 0, playground = []) {
        super(center,size,rotation);
        this._anchorPairs = [];
        this.hovered = false;
        this.svgElement = svgElement;
        this.color = color;
        this.rectangles = playground.rects;//todo store whole scene
        this._initializeAnchorPoints(JSON.parse(svgElement.getAttribute('data-playground')));
        this.startTransformations();
    }
    
    startTransformations(){
        this.shadowBoundingBox = this.cloneDeep();
        this.acceptors= [];

        //console.log(this);
        for(const rect of this.rectangles){
            if(rect!==this){
                this.acceptors.push(
                    ...rect.anchorPoints.acceptors
                )
            }
        }

        //console.log(this.acceptors);

    }

    applyTransformation(transformation){
        this.shadowBoundingBox.applyTransformation(transformation);
        
        const snappedBoundingBox = this.snap(this.shadowBoundingBox);
        this.center = snappedBoundingBox.center;
        this.rotation = snappedBoundingBox.rotation;
        
        //todo optimize cache
        const boundingBox = this.svgElement.getBoundingClientRect();
        const topLeft = new TC.Vector2(boundingBox.left,boundingBox.top);
        const translate = translateToVector(this.svgElement.getAttribute('transform'));        
        const delta = topLeft.subtract(translate);

        this.svgElement.setAttribute('transform',vectorToTranslate(this.topLeft.subtract(delta)));
    }

    snap(originalBoundingBox){//todo bounding box without size

        this._anchorPairs = [];
        //const snappedBoundingBox = originalBoundingBox.clone();
        //snappedBoundingBox.rotation = 0;

        function snapTollerance(originalPosition,snappedPosition,tollerance){
            return originalPosition.length(snappedPosition)>tollerance?originalPosition:snappedPosition;
        }


        const donors = this.anchorPoints.donors;
        const acceptors = this.acceptors;


        //-----------------phase 1

        let targetPair1 = null;

        for(const donor of donors){//todo optimize
            for(const acceptor of acceptors){
                const distance = donor.position.length(acceptor.position);
                if(distance<50){
                    if(!targetPair1){
                        targetPair1 = {distance,donor,acceptor};
                    }else{

                        if(distance<targetPair1.distance){
                            targetPair1 = {distance,donor,acceptor};//todo DRY
                        }
                    }
                }
            }
            //const sortedAcceptors = this.acceptors.sort((acceptor1,acceptor2)=>donor.length(acceptor1)>donor.length(acceptor2)?1:-1);
            //const snappedPosition = sortedAcceptors[0];
            //snappedBoundingBox.center = snapTollerance(originalBoundingBox.center,snappedPosition,50);
        }


        if(!targetPair1){
            return originalBoundingBox;
        }else{

            this._anchorPairs.push(targetPair1);

            //console.log(targetPair1);
            const translation = targetPair1.acceptor.position.subtract(targetPair1.donor.position);

            const snappedBoundingBox = originalBoundingBox.cloneDeep();
            snappedBoundingBox.applyTransformation(
                TC.Transformation.translate(translation)
            )

            targetPair1.acceptor.snapDonor(targetPair1.donor);

            return snappedBoundingBox;


            //-----------------phase 2
            /*/
            const otherDonors = donors
            .filter((donor)=>donor!==targetPair1.donor)
            .map((donor)=>({
                distance: donor.position.length(targetPair1.donor.position),
                original: donor 
            }));

            const otherAcceptors = acceptors
            .filter((acceptor)=>acceptor!==targetPair1.acceptor)
            .map((acceptor)=>({
                distance: acceptor.position.length(targetPair1.acceptor.position),
                original: acceptor
            }));


            let targetPair2 = null;

            for(const otherDonor of otherDonors){
                for(const otherAcceptor of otherAcceptors){

                    if(
                        Math.abs(otherDonor.original.distance - otherAcceptor.original.distance)<5
                    ){
                        const distance = otherDonor.original.position.length(otherAcceptor.original.position);
                        if(distance<100){
                            if(!targetPair2){
                             targetPair2 = {distance,donor:otherDonor.original,acceptor:otherAcceptor.original};
                            }else{
                                if(distance<targetPair2.distance){
                                    targetPair2 = {distance,donor:otherDonor.original,acceptor:otherAcceptor.original};//todo DRY
                                }
                            }
                        }
                    }
                
                }
            }

            if(!targetPair2){
                return snappedBoundingBox;
            }else{

                this._anchorPairs.push(targetPair2);             


                snappedBoundingBox.rotate(
                    targetPair2.acceptor.position.rotation(targetPair1.position.acceptor)
                    -targetPair2.donor.position.add(translation).rotation(targetPair1.acceptor.position)
                    ,targetPair1.acceptor.position
                );
   
                return snappedBoundingBox;

            }
            /**/
            //-----------------

        }


    }

    render(ctx) {
        //this.renderBoundingBox(ctx,this,this.color,this.hovered);
        this.renderBoundingBox(ctx,this.shadowBoundingBox,'rgba(0,0,0,0.2)',false);
        this._anchorPairs.forEach((anchorPair,index)=>{
            this.renderAnchor(ctx,anchorPair.donor,'DONOR',index.toString());
            this.renderAnchor(ctx,anchorPair.acceptor,'ACCEPTOR',index.toString());
        })
        this._afterRender = [];
    }

    renderBoundingBox(ctx,boundingBox,color,hovered){
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();

        ctx.rotate(boundingBox.rotation);
        ctx.translate(
            ...new TC.Vector2(
                    boundingBox.center.x,
                    boundingBox.center.y
                )
                .rotate(-boundingBox.rotation)
            .subtract(
                new TC.Vector2(
                    boundingBox.size.x/2,
                    boundingBox.size.y/2
                )
            )
            .toArray()
        );
        
        ctx.rect( 0,0, boundingBox.size.x,boundingBox.size.y);
        ctx.fill();

        /*{
            ctx.fillStyle = '#ff0000';
            ctx.lineWidth = 3;
            ctx.rect( -5,-5, 10,10);
            ctx.fill();
            ctx.stroke();
        }*/


        if(hovered){
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        ctx.restore();
    }

    renderAnchors(ctx) {
        ctx.lineWidth = 1;
        {
            const size = 15;
            for(const anchor of this.anchorPoints/*Visible*/.acceptors){//todo optimize
                this.renderAnchor(ctx,anchor.position,'ACCEPTOR');
            }
        }
        {
            const size = 10;
            for(const anchor of this.anchorPoints/*Visible*/.donors){//todo optimize
                this.renderAnchor(ctx,anchor.position,'DONOR');
            }
        }
    }

    renderAnchor(ctx,point,type,label=''){//todo as param only anchor object
        let size = 0;
        if(type==='DONOR'){
            size=10;
        }else
        if(type==='ACCEPTOR'){
            size=15;
        }
        ctx.rect( point.x-size/2,point.y-size/2, size,size);
        ctx.stroke();
        if(label){
            ctx.font = "20px Arial";
            ctx.fillText(label,point.x-5,point.y+25); 
        }
    }

    /*get anchorPoints(){
        return this._anchorPoints();
    }

    get anchorPointsVisible(){
        return this._anchorPoints(this);
    }*/

    _initializeAnchorPoints(playgroundConfig){

        /*{
        "amount":1,
        "interactions":[
            {
                "type":"drag"
            }
        ],
        "anchors":{
            "donors":[
                {
                    "type":"trains",
                    "position":{
                    "x":0,
                    "y":15
                    }
                }
            ],
            "acceptors":[
                {
                    "type":"trains",
                    "position":{
                    "x":30,
                    "y":15
                    },
                    "accepts":1,
                    "parent":true
                }
            ]
        }
        }*/
        const donors = playgroundConfig.anchors.donors.map(
            (donorConfig)=>new Donor(
                this,
                donorConfig.type,
                new TC.Vector2(donorConfig.position.x,donorConfig.position.y)//.add(this.shadowBoundingBox.center)
            )
        );       
        const acceptors = playgroundConfig.anchors.acceptors.map(
            (acceptorConfig)=>new Acceptor(
                this,
                acceptorConfig.type,
                new TC.Vector2(acceptorConfig.position.x,acceptorConfig.position.y),//.add(this.shadowBoundingBox.center),
                acceptorConfig.accepts,
                acceptorConfig.parent
            )
        );

        this.anchorPoints = {
            acceptors,
            donors
        };

    }
}


function vectorToTranslate(vector){
    return `translate(${vector.x},${vector.y})`;
}

function translateToVector(translate){
    //todo better and safer implementation
    const inner = translate.split('translate(')[1].split(')')[0]
    const [x,y] = inner.split(',');
    return new TC.Vector2(
        parseFloat(x),
        parseFloat(y)
    );
}
