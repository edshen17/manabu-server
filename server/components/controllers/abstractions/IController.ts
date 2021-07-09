import { IHttpRequest } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { IUsecase } from '../../usecases/abstractions/IUsecase';
import { QueryStringHandler } from '../../usecases/utils/queryStringHandler/queryStringHandler';

export type ControllerResponse<UsecaseResponse> = {
  headers: {};
  statusCode: number;
  body: UsecaseResponse | { err: string };
};

export interface IController<UsecaseResponse> {
  makeRequest: (httpRequest: IHttpRequest) => Promise<ControllerResponse<UsecaseResponse>>;
  init: (props: {
    makeUsecase: Promise<IUsecase<any, UsecaseResponse>>;
    makeQueryStringHandler: QueryStringHandler;
  }) => Promise<this>;
}
