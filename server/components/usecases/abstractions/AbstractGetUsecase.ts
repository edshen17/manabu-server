import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { AbstractUsecase } from './AbstractUsecase';
import { CurrentAPIUser } from './IUsecase';

abstract class AbstractGetUsecase<UsecaseResponse> extends AbstractUsecase<UsecaseResponse> {
  constructor() {
    super('Resource not found.');
  }

  protected _setAccessOptionsTemplate = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    params: any;
    endpointPath: string;
  }) => {
    const { currentAPIUser, isCurrentAPIUserPermitted, params, endpointPath } = props;
    const dbServiceAccessOptions: DbServiceAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf:
        (params.uId && currentAPIUser.userId && params.uId == currentAPIUser.userId) ||
        (currentAPIUser.userId && endpointPath == '/self/me'),
    };
    return dbServiceAccessOptions;
  };
}

export { AbstractGetUsecase };
