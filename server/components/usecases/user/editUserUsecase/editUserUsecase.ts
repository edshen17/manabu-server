import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  AbstractEditUsecase,
  AbstractEditUsecaseInitParams,
} from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { JoinedUserDoc } from '../../../../models/User';

type OptionalEditUserUsecaseInitParams = {
  makeUserDbService: Promise<UserDbService>;
};

type EditUserUsecaseResponse = { user: JoinedUserDoc };

class EditUserUsecase extends AbstractEditUsecase<
  AbstractEditUsecaseInitParams<OptionalEditUserUsecaseInitParams>,
  EditUserUsecaseResponse
> {
  private _userDbService!: UserDbService;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditUserUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const savedDbUser = await this._userDbService.findOneAndUpdate({
      searchQuery: { _id: params.uId },
      updateQuery: body,
      dbServiceAccessOptions,
      dbDependencyUpdateParams: {
        updatedDependeeSearchQuery: { _id: params.uId },
      },
    });

    return { user: savedDbUser };
  };

  protected _initTemplate = async (
    optionalInitParams: AbstractEditUsecaseInitParams<OptionalEditUserUsecaseInitParams>
  ): Promise<void> => {
    const { makeUserDbService, makeEditEntityValidator } = optionalInitParams;
    this._userDbService = await makeUserDbService;
    this._editEntityValidator = makeEditEntityValidator;
  };
}

export { EditUserUsecase, EditUserUsecaseResponse };
