import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { PackageDbService } from '../../dataAccess/services/packagesDb';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { IEntity } from '../abstractions/IEntity';

class PackageTransactionEntity implements IEntity {
  private userDbService!: UserDbService;
  private packageDbService!: PackageDbService;

  private _getDbDataById = async (dbService: any, id: string): Promise<JoinedUserDoc> => {
    const accessOptions: AccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted: true,
      isSelf: false,
      currentAPIUserRole: undefined,
    };
    const dbData = await dbService.findById({ id, accessOptions });
    return dbData;
  };

  public build = async (packageTransactionData: any): Promise<any> => {
    const {
      hostedBy,
      reservedBy,
      packageId,
      reservationLength,
      terminationDate,
      remainingAppointments,
      lessonLanguage,
      isSubscription,
      hostedByData,
      reservedByData,
      packageData,
    } = packageTransactionData;
    return Object.freeze({
      hostedBy,
      reservedBy,
      packageId,
      reservationLength,
      terminationDate,
      remainingAppointments,
      lessonLanguage: lessonLanguage || 'ja',
      isSubscription: isSubscription || false,
      hostedByData: hostedByData || (await this._getDbDataById(this.userDbService, hostedBy)),
      reservedByData: reservedByData || (await this._getDbDataById(this.userDbService, reservedBy)),
      packageData: packageData || (await this._getDbDataById(this.packageDbService, hostedBy)),
    });
  };

  public init = async (makeUserDbService: any, makePackageDbService: any): Promise<this> => {
    this.userDbService = await makeUserDbService;
    this.packageDbService = await makePackageDbService;
    return this;
  };
}

export { PackageTransactionEntity };
