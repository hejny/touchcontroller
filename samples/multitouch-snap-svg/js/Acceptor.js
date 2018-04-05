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

}