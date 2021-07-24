import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractCreateUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse> {
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

  protected _isSelf = (props: {
    params: any;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
  }): boolean => {
    return true;
  };

  protected _isProtectedResource = (): boolean => {
    return false;
  };
}

export { AbstractCreateUsecase };
