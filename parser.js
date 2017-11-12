function parseColon(input) {
  const kvp = input.split(/\s*:\s*/).map(s => s.trim());

  return { [kvp[0]]: kvp[1] };
}

function parseCommas(input) {
  const argPairs = input.split(/\s*,\s*/).map(s => s.trim());

  return argPairs
    .map(parseColon)
    .reduce((arr, cur) => ({ ...arr, ...cur }), {});
}

function parseParenthesis(input) {
  const begin = input.indexOf('(');
  const end = input.lastIndexOf(')');

  const name = input.slice(0, begin).trim();
  const args = parseCommas(input.slice(begin + 1, end).trim());

  return { name, args };
}

function validate(input) {
  const regex = /^\s*\w+\s*(\(\s*\)\s*|\(\s*\w+\s*:\s*\w+\s*(,\s*\w+\s*:\s*\w+\s*)*\)\s*)?$/;
  if (regex.test(input)) {
    return true;
  }

  return false;
}

function parseString(input) {
  if (!validate(input)) {
    throw new Error('Syntax error.');
  }

  if (input.includes('(')) {
    return parseParenthesis(input);
  }
  return { name: input.trim() };
}

export {
  parseColon as _parseColon,
  parseCommas as _parseCommas,
  parseParenthesis as _parseParenthesis,
  validate as _validate
};
export default parseString;
