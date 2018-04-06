class Donor extends Anchor{

    constructor(rect,type,relativePosition,follow=false){
        super(rect,type,relativePosition);
        this.follow = follow;
        this.acceptor = null;
    }

    release(){
        if(this.acceptor){
            this.acceptor.donors = this.acceptor.donors.filter((donor)=>donor!==this);
            this.acceptor = null;
        }
    }
}