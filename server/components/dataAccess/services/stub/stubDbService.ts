import { AbstractDbService } from '../../abstractions/AbstractDbService';

type OptionalStubDbServiceInitParams = {};

type StubDbServiceResponse = undefined;

class StubDbService extends AbstractDbService<
  OptionalStubDbServiceInitParams,
  StubDbServiceResponse
> {}

export { StubDbService, StubDbServiceResponse };
