import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import {
  PackageTransactionEntityBuildParams,
  PackageTransactionEntityBuildResponse,
} from '../../../entities/packageTransaction/packageTransactionEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

type OptionalFakeDbPackageTransactionFactoryInitParams = {
  makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
};

class FakeDbPackageTransactionFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbPackageTransactionFactoryInitParams,
  PackageTransactionEntityBuildParams,
  PackageTransactionEntityBuildResponse,
  PackageTransactionDoc
> {
  private _fakeDbUserFactory!: FakeDbUserFactory;

  protected _createFakeBuildParams = async (): Promise<PackageTransactionEntityBuildParams> => {
    const fakeTeacher = await this._fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
    const fakeUser = await this._fakeDbUserFactory.createFakeDbUser();
    const fakeBuildParams = {
      hostedBy: fakeTeacher._id.toString(),
      reservedBy: fakeUser._id.toString(),
      packageId: fakeTeacher.teacherData.packages[0]._id.toString(),
      reservationLength: 60,
      transactionDetails: { currency: 'SGD', subTotal: 0, total: 0 },
      remainingAppointments: 0,
      lessonLanguage: 'ja',
      isSubscription: false,
      paymentMethodData: {},
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    partialFakeDbDataFactoryInitParams: OptionalFakeDbPackageTransactionFactoryInitParams
  ) => {
    const { makeFakeDbUserFactory } = partialFakeDbDataFactoryInitParams;
    this._fakeDbUserFactory = await makeFakeDbUserFactory;
  };
}

export { FakeDbPackageTransactionFactory };
