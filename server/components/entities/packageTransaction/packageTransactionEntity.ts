import { PackageDoc } from '../../../models/Package';
import { PackageDbService } from '../../dataAccess/services/package/packageDbService';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntityValidator } from '../abstractions/IEntityValidator';

type OptionalPackageTransactionEntityInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makePackageDbService: Promise<PackageDbService>;
  dayjs: any;
};

type PackageTransactionEntityBuildParams = {
  hostedBy: string;
  reservedBy: string;
  packageId: string;
  reservationLength: number;
  transactionDetails: TransactionDetails;
  remainingAppointments: number;
  lessonLanguage: string;
  isSubscription: boolean;
  paymentMethodData: PaymentMethodData;
};

type TransactionDetails = { currency: string; subTotal: number; total: number };
type PaymentMethodData = { method: string; paymentId: string } | {};

type PackageTransactionEntityBuildResponse = {
  hostedBy: string;
  reservedBy: string;
  packageId: string;
  reservationLength: number;
  terminationDate: Date;
  transactionDetails: TransactionDetails;
  remainingAppointments: number;
  lessonLanguage: string;
  isSubscription: boolean;
  transactionDate: Date;
  remainingReschedules: number;
  isTerminated: boolean;
  packageData: PackageDoc;
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
  paymentMethodData: PaymentMethodData;
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
      hostedBy,
      reservedBy,
      packageId,
      reservationLength,
      transactionDetails,
      remainingAppointments,
      lessonLanguage,
      isSubscription,
      paymentMethodData,
    } = buildParams;
    const packageData =
      (await this.getDbDataById({
        dbService: this._packageDbService,
        _id: packageId,
      })) || {};
    const hostedByData =
      (await this.getDbDataById({
        dbService: this._userDbService,
        _id: hostedBy,
      })) || {};
    const reservedByData =
      (await this.getDbDataById({
        dbService: this._userDbService,
        _id: reservedBy,
      })) || {};
    const packageTransactionEntity = Object.freeze({
      hostedBy,
      reservedBy,
      packageId,
      transactionDate: new Date(),
      reservationLength,
      transactionDetails,
      terminationDate: this._dayjs().add(1, 'month').toDate(),
      isTerminated: false,
      remainingAppointments,
      remainingReschedules: 5,
      lessonLanguage,
      isSubscription,
      paymentMethodData,
      packageData,
      hostedByData,
      reservedByData,
    });
    return packageTransactionEntity;
  };

  protected _initTemplate = async (
    partialInitParams: Omit<
      {
        makeEntityValidator: IEntityValidator;
      } & OptionalPackageTransactionEntityInitParams,
      'makeEntityValidator'
    >
  ): Promise<void> => {
    const { makeUserDbService, makePackageDbService, dayjs } = partialInitParams;
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
