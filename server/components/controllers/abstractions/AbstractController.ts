import { IHttpRequest } from '../../expressCallback';
import { IUsecase } from '../../usecases/abstractions/IUsecase';
import { IController } from './IController';

type ControllerParams = { successStatusCode: number; errorStatusCode: number };

abstract class AbstractController implements IController {
  protected usecase!: IUsecase;
  protected successStatusCode!: number;
  protected errorStatusCode!: number;
  constructor(props: ControllerParams) {
    const { successStatusCode, errorStatusCode } = props;
    this.successStatusCode = successStatusCode;
    this.errorStatusCode = errorStatusCode;
  }

  private _awaitUsecaseRes = async (httpRequest: IHttpRequest): Promise<any> => {
    const { currentAPIUser, path, params, body } = httpRequest;
    const controllerData = {
      currentAPIUser,
      endpointPath: path,
      routeData: { params, body },
    };
    const usecaseRes = await this.usecase.makeRequest(controllerData);
    return usecaseRes;
  };

  public makeRequest = async (httpRequest: IHttpRequest): Promise<any> => {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const usecaseRes = await this._awaitUsecaseRes(httpRequest);
      return {
        headers,
        statusCode: this.successStatusCode,
        body: usecaseRes,
      };
    } catch (err) {
      return {
        headers,
        statusCode: this.errorStatusCode,
        body: {
          error: err.message,
        },
      };
    }
  };

  public init = async (props: { makeUsecase: Promise<IUsecase> }): Promise<this> => {
    const { makeUsecase } = props;
    this.usecase = await makeUsecase;
    return this;
  };
}

export { AbstractController, ControllerParams };
