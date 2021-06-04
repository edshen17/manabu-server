export interface IEntity {
  build: (...args: any[]) => {};
  init?: (...args: any[]) => Promise<this>;
}
