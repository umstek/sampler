export default interface IDefinitionObject {
  $init?: { [resolver: string]: any[] };
  [key: string]: any;
}
