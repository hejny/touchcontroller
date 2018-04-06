class Rect extends TC.BoundingBox {
    constructor(color, svgElement, center, size, rotation, playground ) {
        super(center,size,rotation);
        this._anchorPairs = [];
        this.hovered = false;
        this.svgElement = svgElement;
        this.color = color;
        this.playground = playground;
        this.playgroundData = JSON.parse(svgElement.getAttribute('data-playground'));//todo check config
        this._initializeAnchorPoints();
        this.startTransformations(true);
    }

    visualFeedback(){
        this.svgElement.style.opacity = 0.5;
        setTimeout(()=>{
            this.svgElement.style.opacity = 1;
        },500);
    }
    
    startTransformations(initialize=false){

        if(!initialize){
            if(this.playgroundData.amount>1||this.playgroundData.amount===-1){
                const svgElement = this.svgElement.cloneNode(true);
                this.svgElement.parentNode.appendChild(svgElement);
                const playgroundData = JSON.parse(JSON.stringify(this.playgroundData));//todo better
                if(playgroundData.amount>1){
                    playgroundData.amount--;
                }
                svgElement.setAttribute('data-playground',JSON.stringify(playgroundData));
                this.playground.addRect(
                    new Rect(
                        'transparent',//'rgba(1,0,0,0.5)',
                        svgElement,
                        this.center.clone(),
                        this.size.clone(),
                        this.rotation,
                        this.playground 
                    )
                );
                this.playgroundData.amount = 1;
            }
        }

        this.endTransformations();

        this.acceptors= [];
        this.release();

        //console.log(this);
        for(const rect of this.playground.rects){
            if(rect!==this){
                this.acceptors.push(
                    ...rect.anchors.acceptors.filter((acceptor)=>!acceptor.full)
                )
            }
        }

        //console.log(this.acceptors);

    }

    endTransformations(){
        this.shadowBoundingBox = this.cloneDeep();
    }

    applyTransformation(transformation,leading=true,leader=null){

        if(leader===this){
            return;
        }else
        if(!leader){
            leader=this;
        }

        transformation.rotate = 0;

        /*if(leading){
            for(const donor of this.anchors.donors){
                donor.release();
            }
        }*/

        this.shadowBoundingBox.applyTransformation(transformation);
        const snappedBoundingBox = this.snap(this.shadowBoundingBox);

        //const transformationSnapped = transformation;
        /*const transformationSnapped = new TC.Transformation(
            snappedBoundingBox.center.subtract(this.center),
            0,//todo
            1
        );*/
        //const transformationSnapped = this.countTransformation(snappedBoundingBox);

        this.center = snappedBoundingBox.center;
        this.rotation = snappedBoundingBox.rotation;

        
        //const svgPosition = translateToVector(this.svgElement.getAttribute('transform')); 
        //this.svgElement.setAttribute('transform',vectorToTranslate(svgPosition.add(transformationSnapped.translate)));

        //todo optimize cache
        const boundingBox = this.svgElement.getBoundingClientRect();
        const topLeft = new TC.Vector2(boundingBox.left,boundingBox.top);
        const translate = translateToVector(this.svgElement.getAttribute('transform'));        
        const delta = topLeft.subtract(translate);
        this.svgElement.setAttribute('transform',vectorToTranslate(this.topLeft.subtract(delta).add(this.playground.offset)));

        //if(recursion<5){
        
            for(const acceptor of this.anchors.acceptors/*.filter((acceptor)=>acceptor.parent)*/){
                for(const donor of acceptor.followingDonors){

                    donor.rect.applyTransformation(transformation,false,leader);



                }
            }
        //}

    }

    release(){
        for(const donor of this.anchors.donors){
            donor.release();
        }
    }


    snap(originalBoundingBox){//todo bounding box without size

        this.release();

        this._anchorPairs = [];
        //const snappedBoundingBox = originalBoundingBox.clone();
        //snappedBoundingBox.rotation = 0;

        function snapTollerance(originalPosition,snappedPosition,tollerance){
            return originalPosition.length(snappedPosition)>tollerance?originalPosition:snappedPosition;
        }


        const donors = this.anchors.donors;
        const acceptors = this.acceptors;


        //-----------------phase 1

        let targetPair1 = null;

        for(const donor of donors){//todo optimize
            for(const acceptor of acceptors.filter((acceptor)=>acceptor.isAccepting(donor))){
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
        this.renderBoundingBox(ctx,this,this.color,this.hovered);
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
            for(const anchor of this.anchors/*Visible*/.acceptors){//todo optimize
                this.renderAnchor(ctx,anchor.position,'ACCEPTOR');
            }
        }
        {
            const size = 10;
            for(const anchor of this.anchors/*Visible*/.donors){//todo optimize
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

    /*get anchors(){
        return this._anchors();
    }

    get anchorsVisible(){
        return this._anchors(this);
    }*/

    _initializeAnchorPoints(){

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
        const donors = this.playgroundData.anchors.donors.map(
            (donorConfig)=>new Donor(
                this,
                donorConfig.type,
                new TC.Vector2(donorConfig.position.x,donorConfig.position.y),
                donorConfig.follow
            )
        );       
        const acceptors = this.playgroundData.anchors.acceptors.map(
            (acceptorConfig)=>new Acceptor(
                this,
                acceptorConfig.type,
                new TC.Vector2(acceptorConfig.position.x,acceptorConfig.position.y),
                acceptorConfig.accepts,
                acceptorConfig.order
            )
        );

        this.anchors = {
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
