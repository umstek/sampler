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

    it('should process the string to add correct tokens', () => {
      expect(tokenize('(')).to.deep.equal([new Token('BEGIN'), new Token('OPEN_PAREN'), new Token('END')]);
      expect(tokenize(')')).to.deep.equal([new Token('BEGIN'), new Token('CLOSE_PAREN'), new Token('END')]);
      expect(tokenize(':')).to.deep.equal([new Token('BEGIN'), new Token('COLON'), new Token('END')]);
      expect(tokenize(',')).to.deep.equal([new Token('BEGIN'), new Token('COMMA'), new Token('END')]);
    });

    it('should parse simple queries', () => {
      expect(tokenize('name(first:true)')).to.deep.equal([
        new Token('BEGIN'),
        'name',
        new Token('OPEN_PAREN'),
        'first',
        new Token('COLON'),
        'true',
        new Token('CLOSE_PAREN'),
        new Token('END'),
      ]);
    });

    it('should parse intermediate queries', () => {
      expect(tokenize('name(first:true,last:true)')).to.deep.equal([
        new Token('BEGIN'),
        'name',
        new Token('OPEN_PAREN'),
        'first',
        new Token('COLON'),
        'true',
        new Token('COMMA'),
        'last',
        new Token('COLON'),
        'true',
        new Token('CLOSE_PAREN'),
        new Token('END'),
      ]);
    });

    it('should parse complex queries', () => {
      expect(tokenize('or(1:email,name(first:true,last:true))')).to.deep.equal([
        new Token('BEGIN'),
        'or',
        new Token('OPEN_PAREN'),
        '1',
        new Token('COLON'),
        'email',
        new Token('COMMA'),
        'name',
        new Token('OPEN_PAREN'),
        'first',
        new Token('COLON'),
        'true',
        new Token('COMMA'),
        'last',
        new Token('COLON'),
        'true',
        new Token('CLOSE_PAREN'),
        new Token('CLOSE_PAREN'),
        new Token('END'),
      ]);
    });

    it('should treat spaces (only) as separators', () => {
      expect(tokenize('name ( fir st: tr u e)')).to.deep.equal([
        new Token('BEGIN'),
        'name',
        new Token('OPEN_PAREN'),
        'fir',
        'st',
        new Token('COLON'),
        'tr',
        'u',
        'e',
        new Token('CLOSE_PAREN'),
        new Token('END'),
      ]);
      expect(tokenize('name(first: true, last: true)')).to.deep.equal([
        new Token('BEGIN'),
        'name',
        new Token('OPEN_PAREN'),
        'first',
        new Token('COLON'),
        'true',
        new Token('COMMA'),
        'last',
        new Token('COLON'),
        'true',
        new Token('CLOSE_PAREN'),
        new Token('END'),
      ]);
    });
  });
});
