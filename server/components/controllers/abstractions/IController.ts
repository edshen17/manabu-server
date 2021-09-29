import { IUsecase } from '../../usecases/abstractions/IUsecase';
import { QueryStringHandler } from '../../usecases/utils/queryStringHandler/queryStringHandler';
import { IHttpRequest } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';

type ControllerResponse<UsecaseResponse> = {
  headers: {};
  statusCode: number;
  body: UsecaseResponse | { err: string };
};

interface IController<UsecaseResponse> {
  makeRequest: (httpRequest: IHttpRequest) => Promise<ControllerResponse<UsecaseResponse>>;
  init: (props: {
    makeUsecase: Promise<IUsecase<any, UsecaseResponse, any>>;
    makeQueryStringHandler: QueryStringHandler;
  }) => Promise<this>;
}

export { ControllerResponse, IController };
