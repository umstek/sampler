/* eslint-env mocha */

import { expect } from 'chai';

import parseString, {
  _parseColon as parseColon,
  _parseCommas as parseCommas,
  _parseParenthesis as parseParenthesis,
  _validate as validate,
} from '../parser';

describe('parser', () => {
  describe('.validate', () => {
    it('should validate function names', () => {
      expect(validate('name')).to.be.true;
      expect(validate('  name ')).to.be.true;
    });

    it('should validate function name with parenthesis', () => {
      expect(validate('name()')).to.be.true;
      expect(validate(' name(  ) ')).to.be.true;
    });

    it('should validate function with an argument', () => {
      expect(validate('name(first:true)')).to.be.true;
      expect(validate(' name  ( first   : true ) ')).to.be.true;
    });

    it('should validate function with multiple arguments', () => {
      expect(validate('name(first:true,middle:true,last:false)')).to.be.true;
      expect(validate(' name (first :true,middle : true  ,last : false ) ')).to.be.true;
    });
  });

  describe('.parseColon', () => {
    it('should parse one argument', () => {
      expect(parseColon('lol:troll')).to.deep.equal({ lol: 'troll' });
      expect(parseColon(' lol : troll ')).to.deep.equal({ lol: 'troll' });
    });
  });

  describe('.parseCommas', () => {
    it('should parse multiple arguments separated with commas', () => {
      expect(parseCommas('1: 2, 3: 4, 5: 6')).to.deep.equal({ 1: '2', 3: '4', 5: '6' });
    });
  });

  describe('.parseParenthesis', () => {
    it('should parse parenthesis', () => {
      expect(parseParenthesis('name(1: 2, 3: 4, 5: 6)')).to.deep.equal({ name: 'name', args: { 1: '2', 3: '4', 5: '6' } });
    });
  });

  describe('.parseString', () => {
    it('should parse function name', () => {
      expect(parseString('name')).to.deep.equal({ name: 'name' });
    });

    it('should parse functions with arguments', () => {
      expect(parseString('name(1: 2, 3: 4, 5: 6)')).to.deep.equal({ name: 'name', args: { 1: '2', 3: '4', 5: '6' } });
    });

    it('should throw an error if the syntax is wrong', () => {
      expect(() => parseString('name(')).to.throw();
    });
  });
});
