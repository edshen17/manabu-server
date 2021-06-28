import { PackageDoc } from '../../../models/Package';
import { PackageDbService } from '../../dataAccess/services/package/packageDbService';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/user/userDbService';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

type PackageTransactionEntityParams = {
  hostedBy: string;
  reservedBy: string;
  packageId: string;
  reservationLength: number;
  terminationDate?: Date;
  transactionDetails: { currency: string; subTotal: number; total: number };
  remainingAppointments: number;
  lessonLanguage?: string;
  isSubscription?: boolean;
  hostedByData?: JoinedUserDoc;
  reservedByData?: JoinedUserDoc;
  packageData?: PackageDoc;
  paymentMethodData?: { method: string; paymentId?: string };
};

type PackageTransactionEntityResponse = {
  hostedBy: string;
  reservedBy: string;
  packageId: string;
  transactionDate: Date;
  reservationLength: number;
  transactionDetails: { currency: string; subTotal: number; total: number };
  terminationDate: Date;
  isTerminated: boolean;
  remainingAppointments: number;
  remainingReschedules: number;
  lessonLanguage: string;
  isSubscription: boolean;
  methodData?: { method: string; paymentId?: string };
  packageData: PackageDoc;
  hostedByData: JoinedUserDoc;
  reservedByData: JoinedUserDoc;
};

class PackageTransactionEntity
  extends AbstractEntity<PackageTransactionEntityResponse>
  implements IEntity<PackageTransactionEntityResponse>
{
  private _userDbService!: UserDbService;
  private _packageDbService!: PackageDbService;
  private _dayjs!: any;

  public build = async (
    packageEntityData: PackageTransactionEntityParams
  ): Promise<PackageTransactionEntityResponse> => {
    const packageEntity = await this._buildPackageTransactionEntity(packageEntityData);
    return packageEntity;
  };

  private _buildPackageTransactionEntity = async (
    packageEntityData: PackageTransactionEntityParams
  ): Promise<PackageTransactionEntityResponse> => {
    const {
      hostedBy,
      reservedBy,
      packageId,
      reservationLength,
      terminationDate,
      transactionDetails,
      remainingAppointments,
      lessonLanguage,
      isSubscription,
      paymentMethodData,
    } = packageEntityData;
    return Object.freeze({
      hostedBy,
      reservedBy,
      packageId,
      transactionDate: new Date(),
      reservationLength,
      transactionDetails,
      terminationDate: terminationDate || this._dayjs().add(1, 'month').toDate(),
      isTerminated: false,
      remainingAppointments,
      remainingReschedules: 5,
      lessonLanguage: lessonLanguage || 'ja',
      isSubscription: isSubscription || false,
      paymentMethodData: paymentMethodData || {},
      packageData:
        (await this.getDbDataById({ dbService: this._packageDbService, _id: packageId })) || {},
      hostedByData:
        (await this.getDbDataById({ dbService: this._userDbService, _id: hostedBy })) || {},
      reservedByData:
        (await this.getDbDataById({ dbService: this._userDbService, _id: reservedBy })) || {},
    });
  };

  public init = async (props: {
    makeUserDbService: Promise<UserDbService>;
    makePackageDbService: Promise<PackageDbService>;
    dayjs: any;
  }): Promise<this> => {
    const { makeUserDbService, makePackageDbService, dayjs } = props;
    this._userDbService = await makeUserDbService;
    this._packageDbService = await makePackageDbService;
    this._dayjs = dayjs;
    return this;
  };
}

export {
  PackageTransactionEntity,
  PackageTransactionEntityParams,
  PackageTransactionEntityResponse,
};
