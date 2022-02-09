import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { AvailableTimeEntityBuildParams, AvailableTimeEntityBuildResponse } from '../../../entities/availableTime/availableTimeEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';
declare type OptionalFakeDbAvailableTimeFactoryInitParams = {
    makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
    dayjs: any;
};
declare class FakeDbAvailableTimeFactory extends AbstractFakeDbDataFactory<OptionalFakeDbAvailableTimeFactoryInitParams, AvailableTimeEntityBuildParams, AvailableTimeEntityBuildResponse, AvailableTimeDoc> {
    private _fakeDbUserFactory;
    private _dayjs;
    protected _createFakeBuildParams: () => Promise<AvailableTimeEntityBuildParams>;
    protected _initTemplate: (optionalInitParams: OptionalFakeDbAvailableTimeFactoryInitParams) => Promise<void>;
}
export { FakeDbAvailableTimeFactory };
