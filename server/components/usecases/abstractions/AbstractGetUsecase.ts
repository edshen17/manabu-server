import { StringKeyObject } from '../../../types/custom';
import { PaginationOptions } from '../../dataAccess/abstractions/IDbService';
import { AbstractUsecase, IsCurrentAPIUserPermittedParams } from './AbstractUsecase';

abstract class AbstractGetUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse,
  DbServiceResponse
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> {
  protected _isProtectedResource = (props: IsCurrentAPIUserPermittedParams): boolean => {
    const { endpointPath } = props;
    const isProtectedResource = endpointPath.includes('admin');
    return isProtectedResource;
  };

  protected _getPaginationOptions = (props: {
    query: StringKeyObject;
    fallbackQuery: StringKeyObject;
    sort: StringKeyObject;
  }): PaginationOptions => {
    const { query, fallbackQuery, sort } = props;
    const { page, limit } = query;
    const paginationOptions = {
      page: page || fallbackQuery.page,
      limit: limit || fallbackQuery.limit,
      sort,
    };
    return paginationOptions;
  };
}

export { AbstractGetUsecase };
