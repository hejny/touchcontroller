class Anchor{
    constructor(rect,type,relativePosition){
        this.rect = rect;
        this.type = type;
        this._relativePosition = relativePosition;
    }

    get position(){
        return this._relativePosition.add(this.rect.shadowBoundingBox.center);
    }
}