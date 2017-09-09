import { expect } from 'chai';

import { traverseArray } from '../generator';

describe('generator', () => {
    describe('.traverseArray', () => {
        it('should throw if no array is provided', () => {
            expect(traverseArray).to.throw();
        });

        it('should throw if array is null', () => {
            expect(() => traverseArray(null)).to.throw();
        }); 

        it('should throw if not an array', () => {
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
});