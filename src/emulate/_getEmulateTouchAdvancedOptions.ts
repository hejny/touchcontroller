import { IEmulateTouchOptions, IEmulateTouchOptionsAdvanced } from './IEmulateTouchOptions';

export function _getEmulateTouchAdvancedOptions(options: IEmulateTouchOptions): IEmulateTouchOptionsAdvanced {
    if((options as any).position !== undefined){
        return({
            frames: [options as any]
        });
    }else{
        return options as any;
    }
}
