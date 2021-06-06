export interface IEntity {
  build: (entityData: any) => any;
  init?: (props: any) => Promise<this>;
}
