import { PackageDoc } from '../../../models/Package';
import { PackageDbService } from '../../dataAccess/services/packagesDb';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { AbstractEntity } from '../abstractions/AbstractEntity';
import { IEntity } from '../abstractions/IEntity';

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
  private userDbService!: UserDbService;
  private packageDbService!: PackageDbService;
  private dayjs!: any;

  public build = async (entityData: {
    hostedBy: string;
    reservedBy: string;
    packageId: string;
    reservationLength: number;
    terminationDate?: Date;
    transactionDetails: { currency: string; subTotal: number; total: number };
    remainingAppointments: number;
    lessonLanguage?: string;
    isSubscription?: boolean;
    paymentMethodData?: { method: string; paymentId?: string };
  }): Promise<PackageTransactionEntityResponse> => {
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
    } = entityData;

    const optionalEntityValues = await this._processPackageEntityOptionalValues({
      hostedBy,
      reservedBy,
      packageId,
      terminationDate,
      lessonLanguage,
      isSubscription,
    });

    const PACKAGE_ENTITY_DEFAULT_REQUIRED_VALUES = this._PACKAGE_ENTITY_DEFAULT_REQUIRED_VALUES();

    return Object.freeze({
      hostedBy,
      reservedBy,
      packageId,
      reservationLength,
      transactionDetails,
      remainingAppointments,
      paymentMethodData,
      ...optionalEntityValues,
      ...PACKAGE_ENTITY_DEFAULT_REQUIRED_VALUES,
    });
  };

  private _processPackageEntityOptionalValues = async (props: {
    hostedBy: string;
    reservedBy: string;
    packageId: string;
    terminationDate?: Date;
    lessonLanguage?: string;
    isSubscription?: boolean;
  }) => {
    const { hostedBy, reservedBy, packageId, terminationDate, lessonLanguage, isSubscription } =
      props;
    const PACKAGE_ENTITY_DEFAULT_OPTIONAL_VALUES = this._PACKAGE_ENTITY_DEFAULT_OPTIONAL_VALUES();
    return {
      hostedByData: await this._getHostedByData(hostedBy),
      reservedByData: await this._getReservedByData(reservedBy),
      packageData: await this._getPackageData(packageId),
      terminationDate: terminationDate || PACKAGE_ENTITY_DEFAULT_OPTIONAL_VALUES.terminationDate,
      lessonLanguage: lessonLanguage || PACKAGE_ENTITY_DEFAULT_OPTIONAL_VALUES.lessonLanguage,
      isSubscription: isSubscription || PACKAGE_ENTITY_DEFAULT_OPTIONAL_VALUES.isSubscription,
    };
  };

  private _PACKAGE_ENTITY_DEFAULT_OPTIONAL_VALUES = () => {
    const defaultValues: Record<string, any> = Object.freeze({
      terminationDate: this.dayjs().add(1, 'month').toDate(),
      lessonLanguage: 'ja',
      isSubscription: false,
      packageData: {},
      hostedByData: {},
      reservedByData: {},
    });
    return defaultValues;
  };

  private _PACKAGE_ENTITY_DEFAULT_REQUIRED_VALUES = () => {
    return Object.freeze({
      transactionDate: new Date(),
      remainingReschedules: 5,
      isTerminated: false,
    });
  };

  private _getHostedByData = async (userId: string) => {
    return await this._getEntityDependencyData({
      dbService: this.userDbService,
      _id: userId,
      optionalFieldName: 'hostedByData',
    });
  };

  private _getReservedByData = async (packageId: string) => {
    return await this._getEntityDependencyData({
      dbService: this.packageDbService,
      _id: packageId,
      optionalFieldName: 'reservedByData',
    });
  };

  private _getPackageData = async (packageId: string) => {
    return await this._getEntityDependencyData({
      dbService: this.packageDbService,
      _id: packageId,
      optionalFieldName: 'packageData',
    });
  };

  private _getEntityDependencyData = async (props: {
    dbService: any;
    _id: string;
    optionalFieldName: string;
  }) => {
    const { dbService, _id, optionalFieldName } = props;
    const PACKAGE_ENTITY_DEFAULT_OPTIONAL_VALUES = this._PACKAGE_ENTITY_DEFAULT_OPTIONAL_VALUES();

    const dependencyData =
      (await this.getDbDataById(dbService, _id)) ||
      PACKAGE_ENTITY_DEFAULT_OPTIONAL_VALUES[optionalFieldName];
    return dependencyData;
  };

  public init = async (props: {
    makeUserDbService: Promise<UserDbService>;
    makePackageDbService: Promise<PackageDbService>;
    dayjs: any;
  }): Promise<this> => {
    const { makeUserDbService, makePackageDbService, dayjs } = props;
    this.userDbService = await makeUserDbService;
    this.packageDbService = await makePackageDbService;
    this.dayjs = dayjs;
    return this;
  };
}

export { PackageTransactionEntity };
