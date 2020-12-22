import { TouchController } from '../src/touch/TouchController';

describe('TouchController', () => {
    it('can be created', () => {
        expect(() => TouchController.fromCanvas({ addEventListener: () => null } as any)).not.toThrowError();
        // TODO:
    });
});
