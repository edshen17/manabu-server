import { PackageDoc } from '../../../models/Package';
import { JoinedUserDoc } from '../../../models/User';
import { PackageDbService } from '../../dataAccess/services/package/packageDbService';
import { UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalPackageTransactionEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makePackageDbService: Promise<PackageDbService>;
  dayjs: any;
};

type PackageTransactionEntityBuildParams = {
  hostedById: string;
  reservedById: string;
  packageId: string;
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
  hostedById: string;
  reservedById: string;
  packageId: string;
  lessonDuration: number;
  terminationDate: Date;
  priceData: PriceData;
  remainingAppointments: number;
  lessonLanguage: string;
  isSubscription: boolean;
  transactionDate: Date;
  remainingReschedules: number;
  isTerminated: boolean;
  packageData: PackageDoc;
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
  paymentData: PaymentData;
};

class PackageTransactionEntity extends AbstractEntity<
  OptionalPackageTransactionEntityInitParams,
  PackageTransactionEntityBuildParams,
  PackageTransactionEntityBuildResponse
> {
  private _userDbService!: UserDbService;
  private _packageDbService!: PackageDbService;
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
    const packageData =
      (await this.getDbDataById({
        dbService: this._packageDbService,
        _id: packageId,
      })) || {};
    const hostedByData =
      (await this.getDbDataById({
        dbService: this._userDbService,
        _id: hostedById,
      })) || {};
    const reservedByData =
      (await this.getDbDataById({
        dbService: this._userDbService,
        _id: reservedById,
      })) || {};
    const packageTransactionEntity = Object.freeze({
      hostedById,
      reservedById,
      packageId,
      transactionDate: new Date(),
      lessonDuration,
      priceData,
      terminationDate: this._dayjs().add(1, 'month').toDate(),
      isTerminated: false,
      remainingAppointments,
      remainingReschedules: 5,
      lessonLanguage,
      isSubscription,
      paymentData,
      packageData,
      hostedByData,
      reservedByData,
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
    const { makeUserDbService, makePackageDbService, dayjs } = optionalInitParams;
    this._userDbService = await makeUserDbService;
    this._packageDbService = await makePackageDbService;
    this._dayjs = dayjs;
  };
}

export {
  PackageTransactionEntity,
  PackageTransactionEntityBuildParams,
  PackageTransactionEntityBuildResponse,
};
