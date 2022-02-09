import { AppointmentDoc } from '../../../../models/Appointment';
import { AppointmentEntityBuildParams, AppointmentEntityBuildResponse } from '../../../entities/appointment/appointmentEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
declare type OptionalFakeDbAppointmentFactoryInitParams = {
    makeFakeDbPackageTransactionFactory: Promise<FakeDbPackageTransactionFactory>;
    dayjs: any;
};
declare class FakeDbAppointmentFactory extends AbstractFakeDbDataFactory<OptionalFakeDbAppointmentFactoryInitParams, AppointmentEntityBuildParams, AppointmentEntityBuildResponse, AppointmentDoc> {
    private _fakeDbPackageTransactionFactory;
    private _dayjs;
    protected _createFakeBuildParams: () => Promise<AppointmentEntityBuildParams>;
    protected _initTemplate: (optionalInitParams: OptionalFakeDbAppointmentFactoryInitParams) => Promise<void>;
}
export { FakeDbAppointmentFactory };
