export interface vsmObject {
  name: string;
  fkObjectType: number;
  parent?: number;
  childObjects?: Array<vsmObject>;
}
