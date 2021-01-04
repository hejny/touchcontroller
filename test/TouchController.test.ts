import { TouchController } from '../src/touch/TouchController';

describe('TouchController', () => {
    it('can be created', () => {
        expect(() => new TouchController({element: { addEventListener: () => null } as any)}).not.toThrowError();
        // TODO:
    });
});
