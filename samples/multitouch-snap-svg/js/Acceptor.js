class Acceptor extends Anchor{

    constructor(rect,type,relativePosition,accepts,parent){
        super(rect,type,relativePosition);
        this.accepts = accepts;
        this.parent = parent;

        this.donors = [];
    }

    snapDonor(donor){
        if(this.donors.indexOf(donor)===-1){
            donor.acceptor = this;
            this.donors.push(donor);
        }
    }

    get full(){
        if(this.accepts===-1){
            return false;
        }else{
            return (this.donors.length>=this.accepts);
        }
    }

}