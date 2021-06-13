import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { AbstractUsecase } from './AbstractUsecase';
import { CurrentAPIUser } from './IUsecase';

abstract class AbstractGetUsecase<UsecaseResponse> extends AbstractUsecase<UsecaseResponse> {
  constructor() {
    super('Resource not found.');
  }

  protected _setAccessOptionsTemplate = (
    currentAPIUser: CurrentAPIUser,
    isCurrentAPIUserPermitted: boolean,
    params: any
  ) => {
    const accessOptions: AccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: params.uId && currentAPIUser.userId && params.uId == currentAPIUser.userId,
    };
    return accessOptions;
  };
}

export { AbstractGetUsecase };
