import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractCreateUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse,
  DbService
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbService> {
  constructor() {
    super('Access denied.');
  }

  protected _isSelf = (props: {
    params: any;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
  }): boolean => {
    return true;
  };
}

export { AbstractCreateUsecase };
