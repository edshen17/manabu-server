import { AccessOptions } from '../../abstractions/IDbOperations';

interface IFakeDbDataFactory<InitParams, FakeEntityData, DbDoc> {
  init: (
    props: { makeEntity: any; makeDbService: any; cloneDeep: any } & InitParams
  ) => Promise<this> | this;
  getDefaultAccessOptions: () => AccessOptions;
  createFakeDbData?: (fakeEntityData?: FakeEntityData) => Promise<DbDoc>;
}

export { IFakeDbDataFactory };
