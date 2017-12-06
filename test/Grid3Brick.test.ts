/*import Wall from '../src/classes/Grid3Brick';
import Vector3 from '../src/classes/Vector3';

const wall1 = new Wall(
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0)
);

const wall2 = new Wall(
    new Vector3(1, 1, 1),
    new Vector3(1, 1, 1)
);

const wall3 = new Wall(
    new Vector3(2, 1, 1),
    new Vector3(3, 1, 1)
);

const wall4 = new Wall(
    new Vector3(4, 1, 1),
    new Vector3(5, 1, 1)
);

it('diagonal walls are not joinable ', () => {
    expect(wall1.isJoinable(wall2)).toEqual(false);
    expect(wall1.isJoinable(wall3)).toEqual(false);
    expect(wall1.isJoinable(wall4)).toEqual(false);
});

it('near walls are joinable', () => {
    expect(wall2.isJoinable(wall3)).toEqual(true);
    expect(wall3.isJoinable(wall4)).toEqual(true);
});

it('far walls are not joinable', () => {
    expect(wall2.isJoinable(wall4)).toEqual(false);

});

it('joining 3 walls in row and 1 diagonal will result in 2 joined walls', () => {
    expect(Wall.joinWalls([wall1, wall2, wall3, wall4]).length).toEqual(2);
});

const wall2_ = new Wall(
    new Vector3(1, 2, 1),
    new Vector3(1, 2, 1)
);

const wall3_ = new Wall(
    new Vector3(2, 2, 1),
    new Vector3(3, 2, 1)
);

const wall4_ = new Wall(
    new Vector3(4, 2, 1),
    new Vector3(5, 2, 1)
);

it('joining 6 walls in block and 1 diagonal will result in 2 joined walls', () => {
    expect(Wall.joinWalls([wall1, wall2, wall3, wall4, wall2_, wall3_, wall4_]).length).toEqual(2);
});*/