import { AccessOptions, IDbOperations } from '../../dataAccess/abstractions/IDbOperations';
import { MinuteBankDbService } from '../../dataAccess/services/minuteBankDb';
import { PackageTransactionDbService } from '../../dataAccess/services/packageTransactionDb';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { IUsecase } from '../abstractions/IUsecase';
import { makePackageTransactionEntity } from '../../entities/packageTransaction';
import { MinuteBankDoc } from '../../../models/MinuteBank';
import { AbstractPutUsecase } from '../abstractions/AbstractPutUsecase';

type PutUserUsecaseResponse = { user: JoinedUserDoc } | Error;

class PutUserUsecase
  extends AbstractPutUsecase<PutUserUsecaseResponse>
  implements IUsecase<PutUserUsecaseResponse>
{
  private userDbService!: UserDbService;
  private packageTransactionDbService!: PackageTransactionDbService;
  private minuteBankDbService!: MinuteBankDbService;

  public init = async (services: {
    makeUserDbService: Promise<UserDbService>;
    makePackageTransactionDbService: Promise<PackageTransactionDbService>;
    makeMinuteBankDbService: Promise<MinuteBankDbService>;
  }): Promise<this> => {
    const { makeUserDbService, makePackageTransactionDbService, makeMinuteBankDbService } =
      services;
    this.userDbService = await makeUserDbService;
    this.packageTransactionDbService = await makePackageTransactionDbService;
    this.minuteBankDbService = await makeMinuteBankDbService;
    return this;
  };

  protected _isValidBodyTemplate = (body: JoinedUserDoc): any => {
    const { role, _id, dateRegistered } = body;
    return !role && !_id && !dateRegistered;
  };

  protected _makeRequestTemplate = async (props: {
    params: any;
    body: any;
    accessOptions: AccessOptions;
    query?: any;
  }): Promise<PutUserUsecaseResponse> => {
    const { params, body, accessOptions, query } = props;
    const savedDbUser = await this.userDbService.update({
      searchQuery: { _id: params.uId },
      updateParams: body,
      accessOptions,
    });

    //TODO remove/add await for testing..., make alias for below functions (_updateDbUserDependencyData)
    // update minute banks
    this._updateDbUserDependencyData({
      dbService: this.minuteBankDbService,
      savedDbUser,
      accessOptions,
      hostedBySearchQuery: { hostedBy: savedDbUser._id },
      reservedBySearchQuery: { reservedBy: savedDbUser._id },
    });

    // update package transactions
    this._updateDbUserDependencyData({
      dbService: this.packageTransactionDbService,
      savedDbUser,
      accessOptions,
      hostedBySearchQuery: { hostedBy: savedDbUser._id, isPast: false },
      reservedBySearchQuery: { reservedBy: savedDbUser._id, isPast: false },
    });

    // this._updateAppointments(params.uid);
    // this._updateAvailableTimes(params.uid);

    return { user: savedDbUser };
  };

  private _updateDbUserDependencyData = async (props: {
    dbService: IDbOperations<any>;
    savedDbUser: JoinedUserDoc;
    accessOptions: AccessOptions;
    hostedBySearchQuery: any;
    reservedBySearchQuery: any;
  }): Promise<void> => {
    const { dbService, savedDbUser, accessOptions, hostedBySearchQuery, reservedBySearchQuery } =
      props;
    const updateHostedByData = await dbService.updateMany({
      searchQuery: hostedBySearchQuery,
      updateParams: { hostedByData: savedDbUser },
      accessOptions,
    });
    const updateReservedByData = await dbService.updateMany({
      searchQuery: reservedBySearchQuery,
      updateParams: { reservedByData: savedDbUser },
      accessOptions,
    });
  };
}

export { PutUserUsecase, PutUserUsecaseResponse };
