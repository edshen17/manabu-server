import { AbstractDbService } from '../../abstractions/AbstractDbService';
declare type OptionalStubDbServiceInitParams = {};
declare type StubDbServiceResponse = undefined;
declare class StubDbService extends AbstractDbService<OptionalStubDbServiceInitParams, StubDbServiceResponse> {
}
export { StubDbService, StubDbServiceResponse };
