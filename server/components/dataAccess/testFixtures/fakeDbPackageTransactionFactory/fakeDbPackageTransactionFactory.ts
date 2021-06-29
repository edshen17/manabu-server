import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { PackageTransactionEntityBuildResponse } from '../../../entities/packageTransaction/packageTransactionEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';

type PartialFakeDbPackageTransactionFactoryInitParams = {
  makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
};

type FakePackageEntityBuildParams = {
  hostedBy?: string;
  reservedBy?: string;
  packageId?: string;
  reservationLength?: number;
  remainingAppointments?: number;
  transactionDetails?: { currency: string; subTotal: number; total: number };
};

class FakeDbPackageTransactionFactory extends AbstractFakeDbDataFactory<
  PartialFakeDbPackageTransactionFactoryInitParams,
  FakePackageEntityBuildParams,
  PackageTransactionEntityBuildResponse,
  PackageTransactionDoc
> {
  private _fakeDbUserFactory!: FakeDbUserFactory;

  protected _createFakeEntity = async (
    fakeEntityBuildParams?: FakePackageEntityBuildParams
  ): Promise<PackageTransactionEntityBuildResponse> => {
    const {
      hostedBy,
      reservedBy,
      packageId,
      reservationLength,
      remainingAppointments,
      transactionDetails,
    } = fakeEntityBuildParams || {};
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

  protected _initTemplate = async (
    partialFakeDbDataFactoryInitParams: PartialFakeDbPackageTransactionFactoryInitParams
  ) => {
    const { makeFakeDbUserFactory } = partialFakeDbDataFactoryInitParams;
    this._fakeDbUserFactory = await makeFakeDbUserFactory;
  };
}

export { FakeDbPackageTransactionFactory };
