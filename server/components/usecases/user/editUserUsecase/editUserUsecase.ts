import { DbServiceAccessOptions, IDbService } from '../../../dataAccess/abstractions/IDbService';
import { MinuteBankDbService } from '../../../dataAccess/services/minuteBank/minuteBankDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { JoinedUserDoc, UserDbService } from '../../../dataAccess/services/user/userDbService';
import { ControllerData, IUsecase } from '../../abstractions/IUsecase';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type EditUserUsecaseInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeMinuteBankDbService: Promise<MinuteBankDbService>;
};
type EditUserUsecaseResponse = { user: JoinedUserDoc };

class EditUserUsecase extends AbstractEditUsecase<
  EditUserUsecaseInitParams,
  EditUserUsecaseResponse
> {
  private _userDbService!: UserDbService;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _minuteBankDbService!: MinuteBankDbService;

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    const { body } = controllerData.routeData;
    const { role, _id, dateRegistered, verificationToken } = body || {};
    return !role && !_id && !dateRegistered && !verificationToken;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditUserUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const savedDbUser = await this._userDbService.findOneAndUpdate({
      searchQuery: { _id: params.uId },
      updateParams: body,
      dbServiceAccessOptions,
    });

    //TODO remove/add await for testing..., make alias for below functions (_updateDbUserDependencyData)
    // update minute banks
    this._updateDbUserDependencyData({
      dbService: this._minuteBankDbService,
      savedDbUser,
      dbServiceAccessOptions,
      hostedBySearchQuery: { hostedBy: savedDbUser._id },
      reservedBySearchQuery: { reservedBy: savedDbUser._id },
    });

    // update package transactions
    this._updateDbUserDependencyData({
      dbService: this._packageTransactionDbService,
      savedDbUser,
      dbServiceAccessOptions,
      hostedBySearchQuery: { hostedBy: savedDbUser._id, isPast: false },
      reservedBySearchQuery: { reservedBy: savedDbUser._id, isPast: false },
    });

    // this._updateAppointments(params.uid);
    // this._updateAvailableTimes(params.uid);

    return { user: savedDbUser };
  };

  private _updateDbUserDependencyData = async (props: {
    dbService: IDbService<any, any>;
    savedDbUser: JoinedUserDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    hostedBySearchQuery: any;
    reservedBySearchQuery: any;
  }): Promise<void> => {
    const {
      dbService,
      savedDbUser,
      dbServiceAccessOptions,
      hostedBySearchQuery,
      reservedBySearchQuery,
    } = props;
    const updateHostedByData = await dbService.updateMany({
      searchQuery: hostedBySearchQuery,
      updateParams: { hostedByData: savedDbUser },
      dbServiceAccessOptions,
    });
    const updateReservedByData = await dbService.updateMany({
      searchQuery: reservedBySearchQuery,
      updateParams: { reservedByData: savedDbUser },
      dbServiceAccessOptions,
    });
  };

  public init = async (usecaseInitParams: EditUserUsecaseInitParams): Promise<this> => {
    const { makeUserDbService, makePackageTransactionDbService, makeMinuteBankDbService } =
      usecaseInitParams;
    this._userDbService = await makeUserDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._minuteBankDbService = await makeMinuteBankDbService;
    return this;
  };
}

export { EditUserUsecase, EditUserUsecaseResponse };
