import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractGetUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse> {
  constructor() {
    super('Resource not found.');
  }

  protected _getDbServiceAccessOptions = (props: {
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
