import { ObjectId } from 'mongoose';
import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalPackageTransactionEntityInitParams = {
  dayjs: any;
};

type PackageTransactionEntityBuildParams = {
  hostedById: ObjectId;
  reservedById: ObjectId;
  packageId: ObjectId;
  lessonDuration: number;
  remainingAppointments: number;
  lessonLanguage: string;
  isSubscription: boolean;
};

type PackageTransactionEntityBuildResponse = {
  hostedById: ObjectId;
  reservedById: ObjectId;
  packageId: ObjectId;
  lessonDuration: number;
  terminationDate: Date;
  remainingAppointments: number;
  lessonLanguage: string;
  isSubscription: boolean;
  transactionDate: Date;
  isTerminated: boolean;
  status: string;
  createdDate: Date;
  lastModifiedDate: Date;
};

class PackageTransactionEntity extends AbstractEntity<
  OptionalPackageTransactionEntityInitParams,
  PackageTransactionEntityBuildParams,
  PackageTransactionEntityBuildResponse
> {
  private _dayjs!: any;

  protected _buildTemplate = async (
    buildParams: PackageTransactionEntityBuildParams
  ): Promise<PackageTransactionEntityBuildResponse> => {
    const {
      hostedById,
      reservedById,
      packageId,
      lessonDuration,
      remainingAppointments,
      lessonLanguage,
      isSubscription,
    } = buildParams;
    const expiryMonths = isSubscription ? 1 : 3;
    const packageTransactionEntity = {
      hostedById,
      reservedById,
      packageId,
      transactionDate: new Date(),
      lessonDuration,
      terminationDate: this._dayjs().add(expiryMonths, 'month').toDate(),
      isTerminated: false,
      remainingAppointments,
      lessonLanguage,
      isSubscription,
      status: 'confirmed',
      createdDate: new Date(),
      lastModifiedDate: new Date(),
    };
    return packageTransactionEntity;
  };

  protected _initTemplate = async (
    optionalInitParams: Omit<
      {
        makeEntityValidator: AbstractEntityValidator;
      } & OptionalPackageTransactionEntityInitParams,
      'makeEntityValidator'
    >
  ): Promise<void> => {
    const { dayjs } = optionalInitParams;
    this._dayjs = dayjs;
  };
}

export {
  PackageTransactionEntity,
  PackageTransactionEntityBuildParams,
  PackageTransactionEntityBuildResponse,
};
