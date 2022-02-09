import { StringKeyObject } from '../../../types/custom';
import { PaginationOptions } from '../../dataAccess/abstractions/IDbService';
import { AbstractUsecase, IsCurrentAPIUserPermittedParams } from './AbstractUsecase';
declare abstract class AbstractGetUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> {
    protected _isProtectedResource: (props: IsCurrentAPIUserPermittedParams) => boolean;
    protected _getPaginationOptions: (props: {
        query: StringKeyObject;
        fallbackQuery: StringKeyObject;
        sort: StringKeyObject;
    }) => PaginationOptions;
}
export { AbstractGetUsecase };
