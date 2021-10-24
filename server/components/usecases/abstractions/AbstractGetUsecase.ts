import { StringKeyObject } from '../../../types/custom';
import { PaginationOptions } from '../../dataAccess/abstractions/IDbService';
import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractGetUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse,
  DbServiceResponse
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> {
  protected _isProtectedResource = (): boolean => {
    return false;
  };

  protected _getPaginationOptions = (props: {
    query: StringKeyObject;
    fallbackQuery: StringKeyObject;
    sort: StringKeyObject;
  }): PaginationOptions => {
    const { query, fallbackQuery, sort } = props;
    const { page, limit } = query || fallbackQuery;
    const paginationOptions = { page, limit, sort };
    return paginationOptions;
  };
}

export { AbstractGetUsecase };
