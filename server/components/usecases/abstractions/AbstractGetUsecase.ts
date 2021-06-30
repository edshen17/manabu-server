import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { AbstractUsecase } from './AbstractUsecase';
import { CurrentAPIUser } from './IUsecase';

abstract class AbstractGetUsecase<UsecaseInitParams, UsecaseResponse> extends AbstractUsecase<
  UsecaseInitParams,
  UsecaseResponse
> {
  constructor() {
    super('Resource not found.');
  }

  protected _getDbServiceAccessOptionsTemplate = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    params: any;
    endpointPath: string;
  }) => {
    const { currentAPIUser, isCurrentAPIUserPermitted, params, endpointPath } = props;
    const isSelf =
      (params.uId && currentAPIUser.userId && params.uId == currentAPIUser.userId) ||
      (currentAPIUser.userId && endpointPath == '/self/me');
    const dbServiceAccessOptions: DbServiceAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf,
    };
    return dbServiceAccessOptions;
  };
}

export { AbstractGetUsecase };
