import IDefinitionObject from "./IDefinitionObject";

export default interface IParser {
  parse(obj: IDefinitionObject): any;
}
