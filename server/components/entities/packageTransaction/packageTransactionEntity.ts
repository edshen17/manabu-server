import { PackageDoc } from '../../../models/Package';
import { IDbOperations } from '../../dataAccess/abstractions/IDbOperations';
import { PackageDbService } from '../../dataAccess/services/packagesDb';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

class PackageTransactionEntity extends AbstractEntity implements IEntity {
  private userDbService!: UserDbService;
  private packageDbService!: PackageDbService;
  private dayjs!: any;

  constructor(props: { dayjs: any }) {
    super();
    const { dayjs } = props;
    this.dayjs = dayjs;
  }

  public build = async (entityData: {
    hostedBy?: string;
    reservedBy: string;
    packageId?: string;
    reservationLength: number;
    terminationDate?: Date;
    transactionDetails: { currency: string; subTotal: string; total: string };
    remainingAppointments: number;
    lessonLanguage?: string;
    isSubscription?: boolean;
    hostedByData?: JoinedUserDoc;
    reservedByData?: JoinedUserDoc;
    packageData?: PackageDoc;
    methodData?: { method: string; paymentId: string };
  }): Promise<any> => {
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
      methodData,
    } = entityData;
    return Object.freeze({
      hostedBy,
      reservedBy,
      packageId,
      transactionDate: new Date(),
      reservationLength,
      transactionDetails,
      terminationDate: terminationDate || this.dayjs().add(1, 'month').toDate(),
      isTerminated: false,
      remainingAppointments,
      remainingReschedules: 5,
      lessonLanguage: lessonLanguage || 'ja',
      isSubscription: isSubscription || false,
      methodData: methodData || {},
      packageData: (await this._getDbDataById(this.packageDbService, packageId)) || {},
      hostedByData: (await this._getDbDataById(this.userDbService, hostedBy)) || {},
      reservedByData: (await this._getDbDataById(this.userDbService, reservedBy)) || {},
    });
  };

  public init = async (props: {
    makeUserDbService: Promise<UserDbService>;
    makePackageDbService: Promise<PackageDbService>;
  }): Promise<this> => {
    const { makeUserDbService, makePackageDbService } = props;
    this.userDbService = await makeUserDbService;
    this.packageDbService = await makePackageDbService;
    return this;
  };
}

export { PackageTransactionEntity };
