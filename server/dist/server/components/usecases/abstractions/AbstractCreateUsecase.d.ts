import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractUsecase } from './AbstractUsecase';
declare abstract class AbstractCreateUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> extends AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse> {
    protected _isSelf: (props: {
        params: any;
        currentAPIUser: CurrentAPIUser;
        endpointPath: string;
    }) => Promise<boolean>;
}
export { AbstractCreateUsecase };
