import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import {
  AbstractEditUsecase,
  AbstractEditUsecaseInitParams,
} from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { JoinedUserDoc } from '../../../../models/User';
import { NGramHandler } from '../../../entities/utils/nGramHandler/nGramHandler';

type OptionalEditUserUsecaseInitParams = {
  makeNGramHandler: NGramHandler;
};

type EditUserUsecaseResponse = { user: JoinedUserDoc };

class EditUserUsecase extends AbstractEditUsecase<
  AbstractEditUsecaseInitParams<OptionalEditUserUsecaseInitParams>,
  EditUserUsecaseResponse
> {
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
    const user = await this._dbService.findOneAndUpdate({
      searchQuery: { _id: params.userId },
      updateQuery: body,
      dbServiceAccessOptions,
    });

    return { user };
  };

  protected _initTemplate = async (
    optionalInitParams: AbstractEditUsecaseInitParams<OptionalEditUserUsecaseInitParams>
  ): Promise<void> => {
    const { makeEditEntityValidator, makeNGramHandler } = optionalInitParams;
    this._editEntityValidator = makeEditEntityValidator;
    this._nGramHandler = makeNGramHandler;
  };
}

export { EditUserUsecase, EditUserUsecaseResponse };
