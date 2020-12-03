import { padArray } from './padArray';

describe('padArray', () => {
    it('pad empty array with item', () => {
        const array: number[] = [];
        const padWith = 1;
        expect(padArray(array,{padWith, length: 0})).toEqual([]);
        expect(padArray(array,{padWith, length: 1})).toEqual([1]);
        expect(padArray(array,{padWith, length: 2})).toEqual([1,1]);
        expect(padArray(array,{padWith, length: 3})).toEqual([1,1,1]);
    });

    it('pad empty array with array', () => {
        const array: number[] = [];
        const padWith = [1,2,3,4,5,6,7,8,9];
        expect(padArray(array,{padWith, length: 0})).toEqual([]);
        expect(padArray(array,{padWith, length: 1})).toEqual([1]);
        expect(padArray(array,{padWith, length: 2})).toEqual([1,2]);
        expect(padArray(array,{padWith, length: 3})).toEqual([1,2,3]);
    });

    it('pad array with item', () => {
        const array: number[] = [1,2,3];
        const padWith = 1;
        expect(padArray(array,{padWith, length: 3})).toEqual([1,2,3]);
        expect(padArray(array,{padWith, length: 4})).toEqual([1,2,3,1]);
        expect(padArray(array,{padWith, length: 5})).toEqual([1,2,3,1,1]);
        expect(padArray(array,{padWith, length: 6})).toEqual([1,2,3,1,1,1]);
    });

    it('pad array with array', () => {
        const array: number[] = [1,2,3];
        const padWith = [1,2,3,4,5,6,7,8,9];
        expect(padArray(array,{padWith, length: 3})).toEqual([1,2,3]);
        expect(padArray(array,{padWith, length: 4})).toEqual([1,2,3,1]);
        expect(padArray(array,{padWith, length: 5})).toEqual([1,2,3,1,2]);
        expect(padArray(array,{padWith, length: 6})).toEqual([1,2,3,1,2,3]);
    });

    it('crop longer array', () => {
        const array: number[] = [1,2,3];
        const padWith = [1,2,3,4,5,6,7,8,9];
        expect(padArray(array,{padWith, length: 1, crop: true})).toEqual([1]);
        expect(padArray(array,{padWith, length: 2, crop: true})).toEqual([1,2]);
        expect(padArray(array,{padWith, length: 3, crop: true})).toEqual([1,2,3]);
        expect(padArray(array,{padWith, length: 4, crop: true})).toEqual([1,2,3,1]);
    });

    it('do not crop longer array', () => {
        const array: number[] = [1,2,3];
        const padWith = [1,2,3,4,5,6,7,8,9];
        expect(padArray(array,{padWith, length: 1, crop: false})).toEqual([1,2,3]);
        expect(padArray(array,{padWith, length: 2, crop: false})).toEqual([1,2,3]);
        expect(padArray(array,{padWith, length: 3, crop: false})).toEqual([1,2,3]);
        expect(padArray(array,{padWith, length: 4, crop: false})).toEqual([1,2,3,1]);
    });

    it('crop longer array by default', () => {
        const array: number[] = [1,2,3];
        const padWith = [1,2,3,4,5,6,7,8,9];
        expect(padArray(array,{padWith, length: 1})).toEqual([1]);
        expect(padArray(array,{padWith, length: 2})).toEqual([1,2]);
        expect(padArray(array,{padWith, length: 3})).toEqual([1,2,3]);
        expect(padArray(array,{padWith, length: 4})).toEqual([1,2,3,1]);
    });

    it('pad array of arrays with item which is array', () => {
        const array: [number][] = [[1],[2],[3]];
        const padWith = [[1],[2],[3],[4],[5],[6],[7],[8],[9]];
        expect(padArray(array,{padWith, length: 8})).toEqual([[1],[2],[3],[1],[2],[3],[4],[5]]);
    });

    it('is working with edge cases', () => {
        expect(padArray([1,2,3],{padWith: 1, length: -1})).toEqual([]);
    });


    
    it('do not mutate original array', () => {
        const array = [1,2,3];
        padArray(array,{padWith:666, length: 3});
        expect(array).toEqual([1,2,3]);
    });

});
