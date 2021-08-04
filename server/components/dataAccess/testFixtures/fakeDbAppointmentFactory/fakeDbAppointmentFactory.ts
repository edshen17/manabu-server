import { AppointmentDoc } from '../../../../models/Appointment';
import {
  AppointmentEntityBuildParams,
  AppointmentEntityBuildResponse,
} from '../../../entities/appointment/appointmentEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';

type OptionalFakeDbAppointmentFactoryInitParams = {
  makeFakeDbPackageTransactionFactory: Promise<FakeDbPackageTransactionFactory>;
};

class FakeDbAppointmentFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbAppointmentFactoryInitParams,
  AppointmentEntityBuildParams,
  AppointmentEntityBuildResponse,
  AppointmentDoc
> {
  private _fakeDbPackageTransactionFactory!: FakeDbPackageTransactionFactory;

  protected _createFakeBuildParams = async (): Promise<AppointmentEntityBuildParams> => {
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() + 30);
    const fakePackageTransaction = await this._fakeDbPackageTransactionFactory.createFakeDbData();
    const fakeBuildParams = {
      hostedById: fakePackageTransaction.hostedById.toString(),
      reservedById: fakePackageTransaction.reservedById.toString(),
      packageTransactionId: fakePackageTransaction._id.toString(),
      startDate: new Date(),
      endDate,
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalFakeDbAppointmentFactoryInitParams
  ) => {
    const { makeFakeDbPackageTransactionFactory } = optionalInitParams;
    this._fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  };
}

export { FakeDbAppointmentFactory };
