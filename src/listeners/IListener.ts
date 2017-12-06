import TouchController from '../TouchController';

export default interface IListener{
    setListeners: (touchController: TouchController)=>void,
    unsetListeners: ()=>void,
}