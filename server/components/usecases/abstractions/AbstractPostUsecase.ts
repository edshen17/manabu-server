import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { AbstractUsecase } from './AbstractUsecase';
import { CurrentAPIUser } from './IUsecase';

abstract class AbstractPostUsecase<UsecaseResponse> extends AbstractUsecase<UsecaseResponse> {
  constructor() {
    super('Access denied.');
  }

  protected _setAccessOptionsTemplate = (
    currentAPIUser: CurrentAPIUser,
    isCurrentAPIUserPermitted: boolean,
    params: any
  ) => {
    const accessOptions: AccessOptions = {
      isProtectedResource: true,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: params.uId && currentAPIUser.userId && params.uId == currentAPIUser.userId,
    };
    return accessOptions;
  };
}

export { AbstractPostUsecase };
