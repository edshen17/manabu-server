import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { AbstractUsecase } from './AbstractUsecase';
import { CurrentAPIUser } from './IUsecase';

abstract class AbstractCreateUsecase<UsecaseInitParams, UsecaseResponse> extends AbstractUsecase<
  UsecaseInitParams,
  UsecaseResponse
> {
  constructor() {
    super('Access denied.');
  }

  protected _isCurrentAPIUserPermitted = (props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean => {
    const isCurrentAPIUserPermitted = true;
    return isCurrentAPIUserPermitted;
  };

  protected _getDbServiceAccessOptions = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    params: any;
    endpointPath: string;
  }) => {
    const { currentAPIUser, isCurrentAPIUserPermitted } = props;
    const dbServiceAccessOptions: DbServiceAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: true,
    };
    return dbServiceAccessOptions;
  };
}

export { AbstractCreateUsecase };
