import { IDbOperations } from '../../abstractions/IDbOperations';

interface IFakeDbDataFactory<DbDoc> {
  init: (props: any) => Promise<this> | this;
  createFakeDbData?: (entityData: any) => Promise<IDbOperations<DbDoc>>;
}

export { IFakeDbDataFactory };
