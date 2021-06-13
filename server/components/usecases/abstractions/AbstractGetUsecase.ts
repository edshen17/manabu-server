import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractGetUsecase<UsecaseResponse> extends AbstractUsecase<UsecaseResponse> {
  constructor() {
    super('Resource not found.');
  }

  protected _setAccessOptions = (props: {
    currentAPIUser: any;
    isCurrentAPIUserPermitted: boolean;
    params: any;
  }): AccessOptions => {
    const { currentAPIUser, isCurrentAPIUserPermitted, params } = props;
    const accessOptions: AccessOptions = {
      isProtectedResource: true,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: params.uId == currentAPIUser.userId,
    };
    return accessOptions;
  };
}

export { AbstractGetUsecase };
