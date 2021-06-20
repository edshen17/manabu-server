import { AccessOptions, IDbOperations } from '../../abstractions/IDbOperations';

interface IFakeDbDataFactory<DbDoc> {
  init: (props: any) => Promise<this> | this;
  getDefaultAccessOptions: () => AccessOptions;
  createFakeDbData?: (entityData: any) => Promise<IDbOperations<DbDoc>>;
}

export { IFakeDbDataFactory };
