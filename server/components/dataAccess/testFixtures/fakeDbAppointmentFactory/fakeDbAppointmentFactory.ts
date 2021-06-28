import { AppointmentDoc } from '../../../../models/Appointment';
import { AppointmentEntityResponse } from '../../../entities/appointment/appointmentEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';

type FakeDbAppointmentFactoryInitParams = {
  makeFakeDbPackageTransactionFactory: any;
};

type FakeAppointmentEntityParams = {
  hostedBy: string;
  reservedBy: string;
  packageTransactionId: string;
  from: Date;
  to: Date;
};

class FakeDbAppointmentFactory extends AbstractFakeDbDataFactory<
  FakeDbAppointmentFactoryInitParams,
  FakeAppointmentEntityParams,
  AppointmentEntityResponse,
  AppointmentDoc
> {
  private _fakeDbPackageTransactionFactory!: FakeDbPackageTransactionFactory;
  protected _createFakeEntity = async (
    entityData?: FakeAppointmentEntityParams
  ): Promise<AppointmentEntityResponse> => {
    let { hostedBy, reservedBy, packageTransactionId, from, to } = entityData || {};
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
  protected _initTemplate = async (props: FakeDbAppointmentFactoryInitParams) => {
    const { makeFakeDbPackageTransactionFactory } = props;
    this._fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  };
}

export { FakeDbAppointmentFactory };
