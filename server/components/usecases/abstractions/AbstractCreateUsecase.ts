import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractCreateUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse,
  DbDoc
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbDoc> {
  protected _isSelf = async (props: {
    params: any;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
  }): Promise<boolean> => {
    return true;
  };
}

export { AbstractCreateUsecase };
