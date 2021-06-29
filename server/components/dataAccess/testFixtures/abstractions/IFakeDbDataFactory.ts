import { DbServiceAccessOptions } from '../../abstractions/IDbService';

interface IFakeDbDataFactory<FakeDbDataFactoryInitParams, FakeEntityData, DbDoc> {
  init: (
    props: { makeEntity: any; makeDbService: any; cloneDeep: any } & FakeDbDataFactoryInitParams
  ) => Promise<this> | this;
  getDefaultAccessOptions: () => DbServiceAccessOptions;
  createFakeDbData?: (fakeEntityData?: FakeEntityData) => Promise<DbDoc>;
}

export { IFakeDbDataFactory };
