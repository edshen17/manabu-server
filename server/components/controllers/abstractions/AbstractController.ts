import { IHttpRequest } from '../../expressCallback/abstractions/IHttpRequest';
import { IUsecase } from '../../usecases/abstractions/IUsecase';
import { ControllerResponse, IController } from './IController';

type ControllerParams = { successStatusCode: number; errorStatusCode: number };

abstract class AbstractController<UsecaseResponse> implements IController<UsecaseResponse> {
  protected _usecase!: IUsecase<UsecaseResponse>;
  protected _successStatusCode!: number;
  protected _errorStatusCode!: number;
  constructor(props: ControllerParams) {
    const { successStatusCode, errorStatusCode } = props;
    this._successStatusCode = successStatusCode;
    this._errorStatusCode = errorStatusCode;
  }

  public makeRequest = async (
    httpRequest: IHttpRequest
  ): Promise<ControllerResponse<UsecaseResponse>> => {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const usecaseRes = await this._awaitUsecaseRes(httpRequest);
      return {
        headers,
        statusCode: this._successStatusCode,
        body: usecaseRes,
      };
    } catch (err) {
      return {
        headers,
        statusCode: this._errorStatusCode,
        body: { err: err.message },
      };
    }
  };

  private _awaitUsecaseRes = async (httpRequest: IHttpRequest): Promise<UsecaseResponse> => {
    const { currentAPIUser, path, params, body, query } = httpRequest;
    const controllerData = {
      currentAPIUser,
      endpointPath: path,
      routeData: { params, body, query },
    };
    const usecaseRes = await this._usecase.makeRequest(controllerData);
    return usecaseRes;
  };

  public init = async (props: {
    makeUsecase: Promise<IUsecase<UsecaseResponse>>;
  }): Promise<this> => {
    const { makeUsecase } = props;
    this._usecase = await makeUsecase;
    return this;
  };
}

export { AbstractController, ControllerParams };
