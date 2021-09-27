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
  priceData: PriceData;
  remainingAppointments: number;
  lessonLanguage: string;
  isSubscription: boolean;
  paymentData: PaymentData;
};

type PriceData = { currency: string; subTotal: number; total: number };
type PaymentData = { gatewayName: string; gatewayTransactionId: string } | {};

type PackageTransactionEntityBuildResponse = {
  hostedById: ObjectId;
  reservedById: ObjectId;
  packageId: ObjectId;
  lessonDuration: number;
  terminationDate: Date;
  priceData: PriceData;
  remainingAppointments: number;
  lessonLanguage: string;
  isSubscription: boolean;
  transactionDate: Date;
  remainingReschedules: number;
  isTerminated: boolean;
  paymentData: PaymentData;
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
      priceData,
      remainingAppointments,
      lessonLanguage,
      isSubscription,
      paymentData,
    } = buildParams;

    const packageTransactionEntity = Object.freeze({
      hostedById,
      reservedById,
      packageId,
      transactionDate: new Date(),
      lessonDuration,
      priceData,
      terminationDate: this._dayjs().add(2, 'month').toDate(),
      isTerminated: false,
      remainingAppointments,
      remainingReschedules: 5,
      lessonLanguage,
      isSubscription,
      paymentData,
      status: 'confirmed',
      createdDate: new Date(),
      lastModifiedDate: new Date(),
    });
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
