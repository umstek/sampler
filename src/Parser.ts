import Resolver from "./Resolver";
import ChanceResolver from "./Resolver/ChanceResolver";
import EmptyResolver from "./Resolver/EmptyResolver";
import IDefinitionObject from "./IDefinitionObject";
import IParser from "./IParser";
import IResolverConstructor from "./Resolver/IResolverConstructor";
import IResolver from "./Resolver/IResolver";

function unescape(str: string): string {
  return str.substr(0, 2) === "$$" ? str.substr(1) : str;
}

function findResolver(name: string): IResolverConstructor {
  switch (name) {
    case "chance":
      return ChanceResolver;
    default:
      return EmptyResolver;
  }
}

const assign = (final: object, current: object) => ({ ...final, ...current });

const extend = (final: any[], current: any) => [...final, current];

export default class Parser implements IParser {
  constructor(resolvers: { [name: string]: null | IResolverConstructor }) {
    this.resolverConstructors = Object.keys(resolvers)
      .map(key => ({ key: resolvers[key] || findResolver(key) }))
      .reduce(assign, {});
  }

  resolverConstructors: { [name: string]: IResolverConstructor };
  resolver: IResolver;

  initialize = ($init: object) => {
    const resolvers = Object.keys(this.resolverConstructors)
      .map(key => ({
        key,
        Resolver: this.resolverConstructors[key],
        args: $init[key]
      }))
      .map(r => new r.Resolver(r.args))
      .reduce(extend, []);

    this.resolver = new Resolver(resolvers as IResolver[]);
  };

  parse = (obj: IDefinitionObject): any => {
    if (!obj) {
      return null;
    }

    const { $init, ...rest } = obj;
    this.initialize($init || {});

    return this.parseObject(rest);
  };

  parseSwitch = (obj: string | object | any[]): any => {
    if (typeof obj === "string") {
      return this.resolver.resolve(obj);
    }
    if (Array.isArray(obj)) {
      return this.parseArray(obj);
    }
    if (typeof obj === "object") {
      return this.parseObject(obj);
    }
    return obj;
  };

  parseArray = (array: any[]) => {
    return array.map(this.parseSwitch, this);
  };

  parseObject = (obj: {
    [key: string]: any;
    $type?: string;
    $process?: string[];
  }): any => {
    const { $type, $process, ...rest } = obj;

    if ($type) {
      if ($process && Array.isArray($process)) {
        const processed = {
          ...rest,
          ...$process
            .map(elem => ({
              [elem]: this.parseSwitch(rest[elem])
            }))
            .reduce(assign, {})
        };

        const finalObj = Object.keys(processed)
          .map(key => ({
            [unescape(key)]: processed[key]
          }))
          .reduce(assign, {});

        return this.resolver.resolve($type, finalObj);
      }

      return this.resolver.resolve($type, rest);
    }

    return Object.keys(rest)
      .map(key => ({
        [unescape(key)]: this.parseSwitch(rest[key])
      }))
      .reduce(assign, {});
  };

  static readonly chanceParser = new Parser({ chance: null });
}

export { unescape, findResolver };
