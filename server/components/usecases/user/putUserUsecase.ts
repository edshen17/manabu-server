import { AccessOptions, IDbOperations } from '../../dataAccess/abstractions/IDbOperations';
import { MinuteBankDbService } from '../../dataAccess/services/minuteBankDb';
import { PackageTransactionDbService } from '../../dataAccess/services/packageTransactionDb';
import { JoinedUserDoc, UserDbService } from '../../dataAccess/services/usersDb';
import { ControllerData, IUsecase } from '../abstractions/IUsecase';
import { makePackageTransactionEntity } from '../../entities/packageTransaction';
import { MinuteBankDoc } from '../../../models/MinuteBank';

type PutUserUsecaseResponse = { user: JoinedUserDoc } | Error;

class PutUserUsecase implements IUsecase<PutUserUsecaseResponse> {
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

  private _isValidBody = (body: JoinedUserDoc): any => {
    const { role, _id, dateRegistered } = body;
    return !role && !_id && !dateRegistered;
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

  private _makeRequestSetup = (
    controllerData: ControllerData
  ): { isValidUpdate: boolean; accessOptions: AccessOptions; body: any; params: any } => {
    const { routeData, currentAPIUser } = controllerData;
    const { body, params } = routeData;
    const isCurrentAPIUserPermitted =
      params.uId == currentAPIUser.userId || currentAPIUser.role == 'admin';
    const accessOptions: AccessOptions = {
      isProtectedResource: true,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: params.uId == currentAPIUser.userId,
    };
    const isValidUpdate = currentAPIUser.role == 'admin' || this._isValidBody(body);
    return { accessOptions, body, isValidUpdate, params };
  };

  public makeRequest = async (controllerData: ControllerData): Promise<PutUserUsecaseResponse> => {
    const { isValidUpdate, params, body, accessOptions } = this._makeRequestSetup(controllerData);

    if (isValidUpdate) {
      const savedDbUser = await this.userDbService.update({
        searchQuery: { _id: params.uId },
        updateParams: body,
        accessOptions,
      });

      //TODO remove await...
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
    } else {
      throw new Error('You do not have the permissions to update those properties.');
    }
  };
}

export { PutUserUsecase, PutUserUsecaseResponse };
