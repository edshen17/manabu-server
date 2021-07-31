import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  AbstractEditUsecase,
  AbstractEditUsecaseInitParams,
} from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { JoinedUserDoc } from '../../../../models/User';

type OptionalEditUserUsecaseInitParams = {
  makeUserDbService: Promise<UserDbService>;
  createEdgeNGrams: any;
};

type EditUserUsecaseResponse = { user: JoinedUserDoc };

class EditUserUsecase extends AbstractEditUsecase<
  AbstractEditUsecaseInitParams<OptionalEditUserUsecaseInitParams>,
  EditUserUsecaseResponse
> {
  private _userDbService!: UserDbService;
  private _createEdgeNGrams!: any;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditUserUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const { name } = body;
    if (name) {
      body.nameNGrams = this._createEdgeNGrams(name);
    }
    const savedDbUser = await this._userDbService.findOneAndUpdate({
      searchQuery: { _id: params.userId },
      updateQuery: body,
      dbServiceAccessOptions,
    });

    return { user: savedDbUser };
  };

  protected _initTemplate = async (
    optionalInitParams: AbstractEditUsecaseInitParams<OptionalEditUserUsecaseInitParams>
  ): Promise<void> => {
    const { makeUserDbService, makeEditEntityValidator, createEdgeNGrams } = optionalInitParams;
    this._userDbService = await makeUserDbService;
    this._editEntityValidator = makeEditEntityValidator;
    this._createEdgeNGrams = createEdgeNGrams;
  };
}

export { EditUserUsecase, EditUserUsecaseResponse };
