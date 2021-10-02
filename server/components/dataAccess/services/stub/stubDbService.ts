import { AbstractDbService } from '../../abstractions/AbstractDbService';

type OptionalStubDbServiceInitParams = {};

class StubDbService extends AbstractDbService<OptionalStubDbServiceInitParams, undefined> {}

export { StubDbService };
