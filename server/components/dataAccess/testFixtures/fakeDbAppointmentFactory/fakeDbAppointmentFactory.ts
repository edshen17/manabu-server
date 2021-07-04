import { AppointmentDoc } from '../../../../models/Appointment';
import { AppointmentEntityBuildResponse } from '../../../entities/appointment/appointmentEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';

type PartialFakeDbAppointmentFactoryInitParams = {
  makeFakeDbPackageTransactionFactory: Promise<FakeDbPackageTransactionFactory>;
};

type FakeAppointmentEntityBuildParams = {
  hostedBy: string;
  reservedBy: string;
  packageTransactionId: string;
  from: Date;
  to: Date;
};

class FakeDbAppointmentFactory extends AbstractFakeDbDataFactory<
  PartialFakeDbAppointmentFactoryInitParams,
  FakeAppointmentEntityBuildParams,
  AppointmentEntityBuildResponse,
  AppointmentDoc
> {
  private _fakeDbPackageTransactionFactory!: FakeDbPackageTransactionFactory;

  protected _createFakeEntity = async (
    fakeEntityBuildParams?: FakeAppointmentEntityBuildParams
  ): Promise<AppointmentEntityBuildResponse> => {
    let { hostedBy, reservedBy, packageTransactionId, from, to } = fakeEntityBuildParams || {};
    const fakePackageTransaction = await this._fakeDbPackageTransactionFactory.createFakeDbData();

    const fakeAppointmentEntity = await this._entity.build({
      hostedBy: hostedBy || fakePackageTransaction.hostedBy,
      reservedBy: reservedBy || fakePackageTransaction.reservedBy,
      packageTransactionId: packageTransactionId || fakePackageTransaction._id,
      from: from || new Date(),
      to: to || new Date(),
    });
    return fakeAppointmentEntity;
  };

  protected _initTemplate = async (
    partialFakeDbDataFactoryInitParams: PartialFakeDbAppointmentFactoryInitParams
  ) => {
    const { makeFakeDbPackageTransactionFactory } = partialFakeDbDataFactoryInitParams;
    this._fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  };
}

export { FakeDbAppointmentFactory };
