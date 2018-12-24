import Resolver from "./Resolver";
import ChanceResolver from "./Resolver/ChanceResolver";
import EmptyResolver from "./Resolver/EmptyResolver";
import IDefinitionObject from "./IDefinitionObject";
import IParser from "./IParser";
import IResolverConstructor from "./Resolver/IResolverConstructor";
import IResolver from "./Resolver/IResolver";

function unescape(str: String): string {
  return str.replace(/^\$+$/, substr => "$".repeat(substr.length - 1));
}

let parseObject;
let parseArray;

function parseSwitch(resolver: IResolver, obj: string | object) {
  switch (typeof obj) {
    case "string":
      return resolver.resolve(obj);
    case "object":
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

parseArray = (resolver: IResolver, array: any[]) => {
  return array.map(elem => parseSwitch(resolver, elem));
};

parseObject = (
  resolver: IResolver,
  obj: { [key: string]: any; $type?: string; $process?: string[] }
) => {
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
    .reduce(Object.assign, {});
};

function findResolver(name: string): IResolverConstructor {
  switch (name) {
    case "chance":
      return ChanceResolver;
    default:
      return EmptyResolver;
  }
}

export default class Parser implements IParser {
  constructor(resolvers: { [name: string]: null | IResolverConstructor }) {
    this.resolverConstructors = Object.keys(resolvers)
      .map(key => ({ key: resolvers[key] || findResolver(key) }))
      .reduce(Object.assign, {});
  }

  resolverConstructors: { [name: string]: IResolverConstructor };

  parse(obj: IDefinitionObject): any {
    if (!obj) {
      return null;
    }

    const { $init, ...rest } = obj;

    const resolvers = Object.keys($init)
      .map(key => ({ key, Resolver: this.resolverConstructors[key] }))
      .filter(({ Resolver }) => !!Resolver)
      .map(({ key, Resolver }) => new Resolver($init[key]))
      .reduce((arr: IResolver[], resolver) => [...arr, resolver], []);

    return parseObject(new Resolver(resolvers), rest);
  }

  static readonly chanceParser = new Parser({ chance: null });
}
