import { JoinedUserDoc } from '../../../../models/User';
import { UserDbServiceResponse } from '../../../dataAccess/services/user/userDbService';
import { NGramHandler } from '../../../entities/utils/nGramHandler/nGramHandler';
import {
  AbstractEditUsecase,
  AbstractEditUsecaseInitParams,
} from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalEditUserUsecaseInitParams = {
  makeNGramHandler: NGramHandler;
  sanitizeHtml: any;
};

type EditUserUsecaseResponse = { user: JoinedUserDoc };

class EditUserUsecase extends AbstractEditUsecase<
  AbstractEditUsecaseInitParams<OptionalEditUserUsecaseInitParams>,
  EditUserUsecaseResponse,
  UserDbServiceResponse
> {
  private _nGramHandler!: NGramHandler;
  private _sanitizeHtml!: any;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditUserUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const { name, profileBio } = body;
    if (name) {
      body.nameNGrams = this._nGramHandler.createEdgeNGrams({ str: name, isPrefixOnly: false });
      body.namePrefixNGrams = this._nGramHandler.createEdgeNGrams({
        str: name,
        isPrefixOnly: true,
      });
    }
    if (profileBio) {
      body.profileBio = this._sanitizeHtml(profileBio);
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
    const { makeEditEntityValidator, makeNGramHandler, sanitizeHtml } = optionalInitParams;
    this._editEntityValidator = makeEditEntityValidator;
    this._nGramHandler = makeNGramHandler;
    this._sanitizeHtml = sanitizeHtml;
  };
}

export { EditUserUsecase, EditUserUsecaseResponse };
