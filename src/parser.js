import Resolver from './resolvers';

function unescape(str) {
  return str.replace(/^\$+$/, substr => '$'.repeat(substr.length - 1));
}

// no-use-before-define fix
let parseObject;
let parseArray;

function parseSwitch(resolver, obj) {
  switch (typeof obj) {
    case 'string':
      return resolver.resolve(obj);
    case 'object':
      if (obj.constructor.name === {}.constructor.name) {
        return parseObject(resolver, obj);
      }
      if (obj.constructor.name === [].constructor.name) {
        return parseArray(resolver, obj);
      }
      return obj;
    default:
      return obj;
  }
}

parseArray = (resolver, array) =>
  array.map(elem => parseSwitch(resolver, elem));

parseObject = (resolver, obj) => {
  const { $type, $process, ...rest } = obj;

  if ($type) {
    if ($process && $process.constructor.name === [].constructor.name) {
      const processed = {
        ...rest,
        ...$process
          .map(elem => ({
            [elem]: parseSwitch(resolver, rest[elem])
          }))
          .reduce((acc, cur) => ({ ...acc, ...cur }), {})
      };

      const finalObj = Object.keys(processed)
        .map(key => ({
          [unescape(key)]: processed[key]
        }))
        .reduce((acc, cur) => ({ ...acc, ...cur }), {});

      return resolver.resolve($type, finalObj);
    }

    return resolver.resolve($type, rest);
  }

  return Object.keys(rest)
    .map(key => ({
      [unescape(key)]: parseSwitch(resolver, rest[key])
    }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
};

export default function parse(obj) {
  if (!obj) {
    return null;
  }

  const { $init, ...rest } = obj;

  return parseObject(new Resolver($init), rest);
}
