import IResolver from "./IResolver";

export default class Resolver implements IResolver {
  supportedTypes: string[];

  constructor(resolvers: IResolver[]) {
    this.resolvers = resolvers;
    this.supportedTypes = resolvers.reduce(
      (all, resolver) => [...all, ...resolver.supportedTypes],
      []
    );
  }

  resolvers: IResolver[];

  resolve(type: string, args: any[]) {
    for (let i = 0; i < this.resolvers.length; i++) {
      const resolver = this.resolvers[i];
      if (resolver.supportedTypes.includes(type)) {
        return resolver.resolve(type, args);
      }
    }

    return type;
  }
}
