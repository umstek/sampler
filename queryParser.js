/*
 * Query should look something like this:
 *
 * or(1:name(full:true),2:email(tld:.com))
 * name
 * name(locale:it)
 */

class Token {
  constructor(name) {
    this.name = name;
  }
}

const tokenLookup = {
  '(': new Token('OPEN_PAREN'),
  ')': new Token('CLOSE_PAREN'),
  ':': new Token('COLON'),
  ',': new Token('COMMA'),
};

function tokenize(input) {
  if (input === undefined) {
    throw new Error('Input must be provided. ');
  }

  if (input === null) {
    throw new Error('Input must not be null. ');
  }

  if (input.constructor !== ''.constructor) {
    throw new Error('Input must be a string. ');
  }

  const tokens = [];
  tokens.push(new Token('BEGIN'));

  let buffer = '';
  for (let i = 0; i < input.length; i += 1) {
    const character = input[i];
    if (character in tokenLookup) { // Recognized symbol
      if (buffer !== '') {
        tokens.push(buffer);
        buffer = '';
      }
      tokens.push(tokenLookup[character]);
    } else if (/^\s+$/.test(character)) { // Whitespace
      if (buffer !== '') {
        tokens.push(buffer);
        buffer = '';
      }
    } else { // Anything else
      buffer += character;
    }
  }

  if (buffer !== '') {
    tokens.push(buffer);
    buffer = '';
  }

  tokens.push(new Token('END'));
  return tokens;
}

export { Token, tokenize };
