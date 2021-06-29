import { DbServiceAccessOptions } from '../../abstractions/IDbService';

interface IFakeDbDataFactory<PartialFakeDbDataFactoryInitParams, FakeEntityBuildParams, DbDoc> {
  init: (
    fakeDbDataFactoryInitParams: {
      makeEntity: any;
      makeDbService: any;
      cloneDeep: any;
    } & PartialFakeDbDataFactoryInitParams
  ) => Promise<this> | this;
  getDbServiceAccessOptions: () => DbServiceAccessOptions;
  createFakeDbData?: (fakeEntityBuildParams?: FakeEntityBuildParams) => Promise<DbDoc>;
}

export { IFakeDbDataFactory };
