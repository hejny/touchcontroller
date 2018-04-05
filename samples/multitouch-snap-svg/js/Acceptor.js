class Acceptor extends Anchor{

    constructor(rect,type,relativePosition,accepts,parent){
        super(rect,type,relativePosition);
        this.accepts = accepts;
        this.parent = parent;

        this.donors = [];
    }

    snapDonor(donor){
        this.donors.push(donor);
    }

}