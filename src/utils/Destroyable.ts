import { IDestroyable } from '../interfaces/IDestroyable';

export abstract class Destroyable implements IDestroyable {
    private _destroyed = false;
    public get destroyed(): boolean {
        return this._destroyed;
    }
    public async destroy(): Promise<void> {
        this.checkWhetherNotDestroyed();
        this._destroyed = true;
    }

    /**
     *
     * @param errorMessage Message that will replace default one before error
     * @param runBeforeError Callback runed before error is thrown; typically this can be some logging
     */
    protected checkWhetherNotDestroyed(errorMessage?: string, runBeforeError?: () => void): void {
        if (this._destroyed) {
            if (runBeforeError) {
                runBeforeError();
            }
            throw new Error(errorMessage || 'This object is already destroyed.');
        }
    }
}
