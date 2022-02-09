import { JoinedUserDoc } from '../../../../models/User';
import { UserDbServiceResponse } from '../../../dataAccess/services/user/userDbService';
import { NGramHandler } from '../../../entities/utils/nGramHandler/nGramHandler';
import { AbstractEditUsecase, AbstractEditUsecaseInitParams } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalEditUserUsecaseInitParams = {
    makeNGramHandler: NGramHandler;
    sanitizeHtml: any;
};
declare type EditUserUsecaseResponse = {
    user: JoinedUserDoc;
};
declare class EditUserUsecase extends AbstractEditUsecase<AbstractEditUsecaseInitParams<OptionalEditUserUsecaseInitParams>, EditUserUsecaseResponse, UserDbServiceResponse> {
    private _nGramHandler;
    private _sanitizeHtml;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<EditUserUsecaseResponse>;
    protected _initTemplate: (optionalInitParams: AbstractEditUsecaseInitParams<OptionalEditUserUsecaseInitParams>) => Promise<void>;
}
export { EditUserUsecase, EditUserUsecaseResponse };
