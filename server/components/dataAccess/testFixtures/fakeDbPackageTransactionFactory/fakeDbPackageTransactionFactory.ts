import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { PackageTransactionEntityResponse } from '../../../entities/packageTransaction/packageTransactionEntity';
import { AbstractDbDataFactory } from '../abstractions/AbstractDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

class FakeDbPackageTransactionFactory extends AbstractDbDataFactory<
  PackageTransactionDoc,
  PackageTransactionEntityResponse
> {
  private fakeDbUserFactory!: FakeDbUserFactory;

  protected _createFakeEntity = async (
    entityData: any
  ): Promise<PackageTransactionEntityResponse> => {
    const fakeTeacher = await this.fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
    const fakePackageTransaction = await this.entity.build({
      hostedBy: fakeTeacher._id,
      reservedBy: fakeTeacher._id,
      packageId: fakeTeacher.teacherData.packages[0]._id,
      reservationLength: 60,
      remainingAppointments: 5,
      transactionDetails: { currency: 'SGD', subTotal: 0, total: 0 },
    });
    return fakePackageTransaction;
  };

  protected _initTemplate = async (props: any) => {
    const { makeFakeDbUserFactory } = props;
    this.fakeDbUserFactory = await makeFakeDbUserFactory;
  };
}

export { FakeDbPackageTransactionFactory };
