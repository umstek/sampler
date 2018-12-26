import IResolver from "../IResolver";

export default class ChanceResolver implements IResolver {
  supportedTypes: string[];

  constructor(args?: { seed: number }) {
    this.seed = args && args.seed;
    this.supportedTypes = ["seed", "name", "number", "add"];
  }

  seed: number;

  resolve(type: string, args?: { [x: string]: any }) {
    switch (type) {
      case "seed":
        return this.seed;
      case "name":
        return "John Doe";
      case "number":
        return 9;
      case "add":
        return args.a + args.b;
      default:
        return null;
    }
  }
}
