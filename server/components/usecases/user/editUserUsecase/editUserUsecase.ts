import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { ControllerData } from '../../abstractions/IUsecase';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { JoinedUserDoc } from '../../../../models/User';

type OptionalEditUserUsecaseInitParams = {
  makeUserDbService: Promise<UserDbService>;
};
type EditUserUsecaseResponse = { user: JoinedUserDoc };

class EditUserUsecase extends AbstractEditUsecase<
  OptionalEditUserUsecaseInitParams,
  EditUserUsecaseResponse
> {
  private _userDbService!: UserDbService;

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

  protected _initTemplate = async (
    optionalInitParams: OptionalEditUserUsecaseInitParams
  ): Promise<void> => {
    const { makeUserDbService } = optionalInitParams;
    this._userDbService = await makeUserDbService;
  };
}

export { EditUserUsecase, EditUserUsecaseResponse };
