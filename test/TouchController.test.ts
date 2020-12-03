import { TouchController } from '../src/touch/TouchController';

describe('TouchController', () => {
    it('can be created', () => {
        expect(()=>TouchController.fromCanvas(new HTMLCanvasElement)).not.toThrowError();
        // TODO:
    });
});
