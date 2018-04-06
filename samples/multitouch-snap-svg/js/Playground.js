class Playground{

    constructor(
        svgElements,
        touchLayerElement,
        debugCanvasElement=null,


    ){
        //todo use this.svgElement=svgElement;
        this.touchLayerElement=touchLayerElement;
        this.rects = [];
        this._initializeTouchech();
        
        if(debugCanvasElement){
            this.debugCanvasElement=debugCanvasElement;
            this.debugCanvasElementCtx=debugCanvasElement.getContext('2d');
            this._renderLoopTick();
        }

        for(const svgElement of svgElements){
            this._parseSvg(svgElement);
        }

    }

    _parseSvg(svgElement){
        for(const groupElement of svgElement.querySelectorAll('g')){
            const boundingBox = groupElement.getBoundingClientRect();//todo to rect
            this.addRect(
                new Rect(
                    'transparent',//'rgba(1,0,0,0.5)',
                    groupElement,
                    new TC.Vector2(
                        (boundingBox.right+boundingBox.left)/2,
                        (boundingBox.bottom+boundingBox.top)/2,
                        ),
                    new TC.Vector2(
                        boundingBox.right-boundingBox.left,
                        boundingBox.bottom-boundingBox.top,
                    ),
                    0,
                    this
                )
            );
        }
    }


    addRect(rect){
        this.rects.push(rect);
    }

    
    _initializeTouchech(){
        const touchController = new TC.TouchController(this.touchLayerElement);
        const multiTouchController = new TC.MultiTouchController(
            touchController,
            (position)=>this.rects.find((rect) => rect.intersects(position))
        );



        //console.log(multiTouchController);
        multiTouchController.hoveredElementsChanges.subscribe(([elementNew,elementOld])=>{
            //console.log([elementNew,elementOld]);
            if(elementNew||false){
                elementNew.hovered = true;
            }
            if(elementOld||false){
                elementOld.hovered = false;
            }
        });


        multiTouchController.multiTouches.subscribe(function (multitouch) {

            if(typeof multitouch.element === 'undefined')return;
            const rect = multitouch.element;
            const sizeRatio = rect.size.y / rect.size.x;

            rect.startTransformations();

            multitouch.transformations(
                /*new TC.Transformation(
                    rect.center,
                    rect.rotation,
                    rect.size.x
                )*/
                rect
            ).subscribe(function (transformation) {

                    //console.log(transformation);

                    /*multitouch.element.center = transformation.translate;
                    multitouch.element.rotation = transformation.rotate;
                    multitouch.element.size.x = transformation.scale;
                    multitouch.element.size.y = transformation.scale * sizeRatio;*/

                    //multitouch.element.position = multitouch.element.position.add(transformation.translate);


                },
                function () {
                },
                function () {

                    //todo not nessesery
                    rect.startTransformations();

                    if(multitouch.empty){
                        //alert(`You have selected ${multitouch.element.color} rectangle.`);
                        //rect.rotation += (Math.PI*2)/36;
            
                    }
                });
        });

    }

    _renderLoopTick(){
        //console.log(`Rendring ${this.rects.length} rectangles.`);
        this.debugCanvasElementCtx.clearRect(0, 0, this.debugCanvasElementCtx.canvas.width, this.debugCanvasElementCtx.canvas.height);
        for (const rect of this.rects.slice().reverse()) {
            rect.render(this.debugCanvasElementCtx);
        }
        for (const rect of this.rects) {
            rect.renderAnchors(this.debugCanvasElementCtx);
        }
        requestAnimationFrame(()=>this._renderLoopTick());

    }



}