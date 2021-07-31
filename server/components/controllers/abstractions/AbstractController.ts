import { IHttpRequest } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { IUsecase } from '../../usecases/abstractions/IUsecase';
import { ControllerResponse, IController } from './IController';
import { QueryStringHandler } from '../../usecases/utils/queryStringHandler/queryStringHandler';

type ControllerParams = { successStatusCode: number; errorStatusCode: number };

abstract class AbstractController<UsecaseResponse> implements IController<UsecaseResponse> {
  protected _usecase!: IUsecase<any, UsecaseResponse>;
  protected _queryStringHandler!: QueryStringHandler;
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
      const usecaseRes = await this._getUsecaseRes(httpRequest);
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

  private _getUsecaseRes = async (httpRequest: IHttpRequest): Promise<UsecaseResponse> => {
    const { currentAPIUser, path, params, body, query } = httpRequest;
    const decodedQuery = this._queryStringHandler.decodeQueryStringObj(query);
    const controllerData = {
      currentAPIUser,
      endpointPath: path,
      routeData: { params, body, query: decodedQuery },
    };
    const usecaseRes = await this._usecase.makeRequest(controllerData);
    return usecaseRes;
  };

  public init = async (props: {
    makeUsecase: Promise<IUsecase<any, UsecaseResponse>>;
    makeQueryStringHandler: QueryStringHandler;
  }): Promise<this> => {
    const { makeUsecase, makeQueryStringHandler } = props;
    this._usecase = await makeUsecase;
    this._queryStringHandler = makeQueryStringHandler;
    return this;
  };
}

export { AbstractController, ControllerParams };
