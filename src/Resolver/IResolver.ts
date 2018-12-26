export default interface IResolver {
  supportedTypes: string[];

  resolve(type: string, args?: { [x: string]: any }): any;
}
