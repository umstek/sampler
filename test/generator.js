import { expect } from 'chai';

import { traverseArray, traverseObject } from '../generator';

describe('generator', () => {
    describe('.traverseArray', () => {
        it('should throw if no array is provided', () => {
            expect(traverseArray).to.throw();
        });

        it('should throw if array is null', () => {
            expect(() => traverseArray(null)).to.throw();
        });

        it('should throw if argument is not an array', () => {
            expect(() => traverseArray(true)).to.throw();
            expect(() => traverseArray(1.1)).to.throw();
            expect(() => traverseArray("array")).to.throw();
            expect(() => traverseArray(new Symbol())).to.throw();
            expect(() => traverseArray({})).to.throw();
        });

        it('should return empty array for an empty array', () => {
            expect(traverseArray([])).to.be.empty;
        });

        it('should throw if array contains anything except objects or strings');

        it('should return same number of items');
    });

    describe(".traverseObject", () => {
        it('should throw if no object is provided', () => {
            expect(traverseObject).to.throw();
        });

        it('should throw if object is null', () => {
            expect(() => traverseObject(null)).to.throw();
        });

        it('should throw if argument is not an object', () => {
            expect(() => traverseObject(true)).to.throw();
            expect(() => traverseObject(1.1)).to.throw();
            expect(() => traverseObject("array")).to.throw();
            expect(() => traverseObject(new Symbol())).to.throw();
            expect(() => traverseObject([])).to.throw();
        });

        it('should return empty object for an empty object')

        it('should throw if any object key is not a string');

        it('should throw if any object value is not array or object or string');

        it('should return an object with the same number of entries');
    });
});