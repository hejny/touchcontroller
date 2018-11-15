declare global {
    interface Window {
        setImmediate: (callback: () => void) => void;
        location: Location;
    }
}
declare const currentWindow: Window;
export default currentWindow;
