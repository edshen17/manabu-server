import { IHttpRequest } from '../../expressCallback';
import { IUsecase } from '../../usecases/abstractions/IUsecase';

export type ControllerResponse<UsecaseResponse> = {
  headers: {};
  statusCode: number;
  body: UsecaseResponse | { err: string };
};

export interface IController<UsecaseResponse> {
  makeRequest: (httpRequest: IHttpRequest) => Promise<ControllerResponse<UsecaseResponse>>;
  init: (props: { makeUsecase: Promise<IUsecase<UsecaseResponse>> }) => Promise<this>;
}
