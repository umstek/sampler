import IResolver from "./IResolver";

export default class EmptyResolver implements IResolver {
  supportedTypes: string[];
  resolve(type: string, args?: { [x: string]: any }) {
    return null;
  }
}
