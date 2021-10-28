import { AppointmentDoc } from '../../../../models/Appointment';
import {
  AppointmentEntityBuildParams,
  AppointmentEntityBuildResponse,
} from '../../../entities/appointment/appointmentEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';

type OptionalFakeDbAppointmentFactoryInitParams = {
  makeFakeDbPackageTransactionFactory: Promise<FakeDbPackageTransactionFactory>;
  dayjs: any;
};

class FakeDbAppointmentFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbAppointmentFactoryInitParams,
  AppointmentEntityBuildParams,
  AppointmentEntityBuildResponse,
  AppointmentDoc
> {
  private _fakeDbPackageTransactionFactory!: FakeDbPackageTransactionFactory;
  private _dayjs!: any;

  protected _createFakeBuildParams = async (): Promise<AppointmentEntityBuildParams> => {
    const fakePackageTransaction = await this._fakeDbPackageTransactionFactory.createFakeDbData();
    const fakeBuildParams = {
      hostedById: fakePackageTransaction.hostedById,
      reservedById: fakePackageTransaction.reservedById,
      packageTransactionId: fakePackageTransaction._id,
      startDate: this._dayjs().toDate(),
      endDate: this._dayjs().add(1, 'hour').toDate(),
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalFakeDbAppointmentFactoryInitParams
  ) => {
    const { makeFakeDbPackageTransactionFactory, dayjs } = optionalInitParams;
    this._fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
    this._dayjs = dayjs;
  };
}

export { FakeDbAppointmentFactory };
