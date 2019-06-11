import { expect } from 'chai';
import { BoundingBox } from '../src/BoundingBox';
import { Vector2 } from '../src/Vector2';

describe('BoundingBox', function() {
    const boundingBox1 = new BoundingBox(
        new Vector2(1, 1),
        new Vector2(2, 2),
        0,
    );

    it('intersects is working.', function() {
        expect(boundingBox1.intersects(new Vector2(1, 1))).equal(true);
        expect(boundingBox1.intersects(new Vector2(2, 2))).equal(true);
        expect(boundingBox1.intersects(new Vector2(3, 3))).equal(false);
    });
});
