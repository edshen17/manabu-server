import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { AbstractUsecase } from './AbstractUsecase';
import { ControllerData, IUsecase } from './IUsecase';

abstract class AbstractPutUsecase<UsecaseResponse> extends AbstractUsecase<UsecaseResponse> {
  constructor() {
    super('Access denied.');
  }

  protected abstract _makeRequestTemplate(props: {
    params: any;
    body: any;
    accessOptions: AccessOptions;
    query?: any;
  }): Promise<UsecaseResponse>;

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

export { AbstractPutUsecase };
