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
    const fakePackageTransaction = await this._fakeDbPackageTransactionFactory.createFakeDbData();
    const fakeBuildParams = {
      hostedBy: fakePackageTransaction.hostedBy.toString(),
      reservedBy: fakePackageTransaction.reservedBy.toString(),
      packageTransactionId: fakePackageTransaction._id,
      from: new Date(),
      to: new Date(),
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    partialFakeDbDataFactoryInitParams: OptionalFakeDbAppointmentFactoryInitParams
  ) => {
    const { makeFakeDbPackageTransactionFactory } = partialFakeDbDataFactoryInitParams;
    this._fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  };
}

export { FakeDbAppointmentFactory };
