import { AccessOptions, IDbOperations } from '../../../dataAccess/abstractions/IDbOperations';
import { MinuteBankDbService } from '../../../dataAccess/services/minuteBank/minuteBankDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { JoinedUserDoc, UserDbService } from '../../../dataAccess/services/user/userDbService';
import { ControllerData, IUsecase } from '../../abstractions/IUsecase';
import { makePackageTransactionEntity } from '../../../entities/packageTransaction';
import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type EditUserUsecaseResponse = { user: JoinedUserDoc } | Error;

class EditUserUsecase
  extends AbstractEditUsecase<EditUserUsecaseResponse>
  implements IUsecase<EditUserUsecaseResponse>
{
  private _userDbService!: UserDbService;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _minuteBankDbService!: MinuteBankDbService;

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    const { body } = controllerData.routeData;
    const { role, _id, dateRegistered } = body || {};
    return !role && !_id && !dateRegistered;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditUserUsecaseResponse> => {
    const { params, body, accessOptions } = props;
    const savedDbUser = await this._userDbService.findOneAndUpdate({
      searchQuery: { _id: params.uId },
      updateParams: body,
      accessOptions,
    });

    //TODO remove/add await for testing..., make alias for below functions (_updateDbUserDependencyData)
    // update minute banks
    this._updateDbUserDependencyData({
      dbService: this._minuteBankDbService,
      savedDbUser,
      accessOptions,
      hostedBySearchQuery: { hostedBy: savedDbUser._id },
      reservedBySearchQuery: { reservedBy: savedDbUser._id },
    });

    // update package transactions
    this._updateDbUserDependencyData({
      dbService: this._packageTransactionDbService,
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

  public init = async (services: {
    makeUserDbService: Promise<UserDbService>;
    makePackageTransactionDbService: Promise<PackageTransactionDbService>;
    makeMinuteBankDbService: Promise<MinuteBankDbService>;
  }): Promise<this> => {
    const { makeUserDbService, makePackageTransactionDbService, makeMinuteBankDbService } =
      services;
    this._userDbService = await makeUserDbService;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._minuteBankDbService = await makeMinuteBankDbService;
    return this;
  };
}

export { EditUserUsecase, EditUserUsecaseResponse };
