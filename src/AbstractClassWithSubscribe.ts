export default class AbstractClassWithSubscribe<TEvent,TValue>{

    private _subscribers: {event: TEvent; callback: ((newValue: TValue) => void)}[] = [];

    subscribe(event:TEvent/*maybe multiple events TEvent[]*/, callback: (newValue: TValue) => void) {
        this._subscribers.push({
            event,
            callback
        });
    }

    //todo unsubscribe

    callSubscribers(event:TEvent, newValue: TValue){
        this._subscribers
            .filter((subscriber) => subscriber.event === event)
            .forEach((subscriber) => subscriber.callback(newValue));
    }

}