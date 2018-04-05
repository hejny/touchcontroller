class Donor extends Anchor{

    constructor(rect,type,relativePosition){
        super(rect,type,relativePosition);
        this.acceptor = null;
    }

    release(){
        if(this.acceptor){
            this.acceptor.donors = this.acceptor.donors.filter((donor)=>donor!==this);
            this.acceptor = null;
        }
    }
}