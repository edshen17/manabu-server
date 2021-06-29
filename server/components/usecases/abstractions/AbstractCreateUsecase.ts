import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { AbstractUsecase } from './AbstractUsecase';
import { CurrentAPIUser } from './IUsecase';

abstract class AbstractCreateUsecase<UsecaseResponse> extends AbstractUsecase<UsecaseResponse> {
  constructor() {
    super('Access denied.');
  }

  protected _isCurrentAPIUserPermitted = (props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean => {
    return true;
  };

  protected _setAccessOptionsTemplate = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    params: any;
    endpointPath: string;
  }) => {
    const { currentAPIUser, isCurrentAPIUserPermitted } = props;
    const accessOptions: DbServiceAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: true,
    };
    return accessOptions;
  };
}

export { AbstractCreateUsecase };
