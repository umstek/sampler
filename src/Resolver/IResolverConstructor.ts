import IResolver from "./IResolver";

export default interface IResolverConstructor {
  new (args?: { [arg: string]: any }): IResolver;
}
