import { IHttpRequest } from '../../expressCallback';
import { IUsecase } from '../../usecases/abstractions/IUsecase';

export interface IController {
  makeRequest: (httpRequest: IHttpRequest) => Promise<any>;
  init: (props: { makeUsecase: Promise<IUsecase> }) => Promise<this>;
}
