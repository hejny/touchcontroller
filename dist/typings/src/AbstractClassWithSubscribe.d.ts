export default class AbstractClassWithSubscribe<TEvent, TValue> {
    private _subscribers;
    subscribe(event: TEvent, callback: (newValue: TValue) => void): void;
    callSubscribers(event: TEvent, newValue: TValue): void;
}
