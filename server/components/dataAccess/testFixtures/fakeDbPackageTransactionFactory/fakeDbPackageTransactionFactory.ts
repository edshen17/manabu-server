import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { PackageTransactionEntityResponse } from '../../../entities/packageTransaction/packageTransactionEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

class FakeDbPackageTransactionFactory extends AbstractFakeDbDataFactory<
  PackageTransactionDoc,
  PackageTransactionEntityResponse
> {
  private _fakeDbUserFactory!: FakeDbUserFactory;

  protected _createFakeEntity = async (
    entityData: any
  ): Promise<PackageTransactionEntityResponse> => {
    const {
      hostedBy,
      reservedBy,
      packageId,
      reservationLength,
      remainingAppointments,
      transactionDetails,
    } = entityData || {};
    const fakeTeacher = await this._fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
    const fakePackageTransaction = await this._entity.build({
      hostedBy: hostedBy || fakeTeacher._id,
      reservedBy: reservedBy || fakeTeacher._id,
      packageId: packageId || fakeTeacher.teacherData.packages[0]._id,
      reservationLength: reservationLength || 60,
      remainingAppointments: remainingAppointments || 5,
      transactionDetails: transactionDetails || { currency: 'SGD', subTotal: 0, total: 0 },
    });
    return fakePackageTransaction;
  };

  protected _initTemplate = async (props: any) => {
    const { makeFakeDbUserFactory } = props;
    this._fakeDbUserFactory = await makeFakeDbUserFactory;
  };
}

export { FakeDbPackageTransactionFactory };
