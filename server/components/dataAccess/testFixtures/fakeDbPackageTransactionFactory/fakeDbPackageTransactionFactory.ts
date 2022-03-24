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
    const fakeTeacher = await this._fakeDbUserFactory.createFakeDbTeacher();
    const fakeUser = await this._fakeDbUserFactory.createFakeDbUser();
    const fakeBuildParams = {
      hostedById: fakeTeacher._id,
      reservedById: fakeUser._id,
      packageId: fakeTeacher.teacherData!.packages[0]._id,
      lessonDuration: 60,
      remainingAppointments: 12,
      lessonLanguage: 'ja',
      isSubscription: false,
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalFakeDbPackageTransactionFactoryInitParams
  ): Promise<void> => {
    const { makeFakeDbUserFactory } = optionalInitParams;
    this._fakeDbUserFactory = await makeFakeDbUserFactory;
  };
}

export { FakeDbPackageTransactionFactory };
