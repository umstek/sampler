/* eslint-env mocha */

import { expect } from 'chai';

import { Token, tokenize } from '../queryParser';

describe('query parser', () => {
  describe('.tokenize', () => {
    it('should throw if no argument is provided', () => {
      expect(tokenize).to.throw();
    });

    it('should throw if argument is null', () => {
      expect(() => tokenize(null)).to.throw();
    });

    it('should throw if argument is not a string', () => {
      expect(() => tokenize(true)).to.throw();
      expect(() => tokenize(1.1)).to.throw();
      expect(() => tokenize('string')).not.to.throw();
      expect(() => tokenize([])).to.throw();
      expect(() => tokenize({})).to.throw();
    });

    it('should return BEGIN, END tokens for an empty string', () => {
      expect(tokenize('')).to.deep.equal([new Token('BEGIN'), new Token('END')]).but.have.a.lengthOf(2);
    });

    it('should return BEGIN, END tokens and "name" in the middle for "name"', () => {
      expect(tokenize('name')).to.deep.equal([new Token('BEGIN'), 'name', new Token('END')]);
    });
  });
});
