import { DbServiceAccessOptions, IDbService } from '../../../dataAccess/abstractions/IDbService';
import { MinuteBankDbService } from '../../../dataAccess/services/minuteBank/minuteBankDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { JoinedUserDoc, UserDbService } from '../../../dataAccess/services/user/userDbService';
import { ControllerData } from '../../abstractions/IUsecase';
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
    // entity.validate({ validationType: CREATE/EDIT, userRole: , }, buildParams)
    //this._queryValidator.validate(query)
    //this._paramsValidator.validate(params)
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

    return { user: savedDbUser };
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
