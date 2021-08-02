import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  AbstractEditUsecase,
  AbstractEditUsecaseInitParams,
} from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { JoinedUserDoc } from '../../../../models/User';
import { NGramHandler } from '../../../entities/utils/nGramHandler/nGramHandler';

type OptionalEditUserUsecaseInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makeNGramHandler: NGramHandler;
};

type EditUserUsecaseResponse = { user: JoinedUserDoc };

class EditUserUsecase extends AbstractEditUsecase<
  AbstractEditUsecaseInitParams<OptionalEditUserUsecaseInitParams>,
  EditUserUsecaseResponse
> {
  private _userDbService!: UserDbService;
  private _nGramHandler!: NGramHandler;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditUserUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const { name } = body;
    if (name) {
      body.nameNGrams = this._nGramHandler.createEdgeNGrams({ str: name, isPrefixOnly: false });
      body.namePrefixNGrams = this._nGramHandler.createEdgeNGrams({
        str: name,
        isPrefixOnly: true,
      });
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
    const { makeUserDbService, makeEditEntityValidator, makeNGramHandler } = optionalInitParams;
    this._userDbService = await makeUserDbService;
    this._editEntityValidator = makeEditEntityValidator;
    this._nGramHandler = makeNGramHandler;
  };
}

export { EditUserUsecase, EditUserUsecaseResponse };
