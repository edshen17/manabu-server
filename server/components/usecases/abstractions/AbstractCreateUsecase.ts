import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractUsecase } from './AbstractUsecase';

abstract class AbstractCreateUsecase<
  OptionalUsecaseInitParams,
  UsecaseResponse,
  DbServiceResponse
> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> {
  protected _isSelf = async (props: {
    params: any;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
  }): Promise<boolean> => {
    const { currentAPIUser } = props;
    const isSelf = currentAPIUser.userId ? true : false;
    return isSelf;
  };
}

export { AbstractCreateUsecase };
