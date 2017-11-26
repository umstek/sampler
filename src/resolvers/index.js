import ChanceResolver from './ChanceResolver';

export default class Resolver {
  constructor(args) {
    this.chanceResolver = args
      ? new ChanceResolver(args.chance)
      : new ChanceResolver();
  }

  resolve(type, args) {
    if (ChanceResolver.SUPPORTED_TYPES.indexOf(type) !== -1) {
      return this.chanceResolver.resolve(type, args);
    }

    return type;
  }
}
