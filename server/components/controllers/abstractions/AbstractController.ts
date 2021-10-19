import { StringKeyObject } from '../../../types/custom';
import { IUsecase } from '../../usecases/abstractions/IUsecase';
import { QueryStringHandler } from '../../usecases/utils/queryStringHandler/queryStringHandler';
import { IHttpRequest } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse, IController } from './IController';

type ControllerParams = { successStatusCode: number; errorStatusCode: number };

abstract class AbstractController<UsecaseResponse> implements IController<UsecaseResponse> {
  protected _usecase!: IUsecase<any, UsecaseResponse, any>;
  protected _queryStringHandler!: QueryStringHandler;
  protected _successStatusCode!: number;
  protected _errorStatusCode!: number;
  protected _convertStringToObjectId!: any;

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
    } catch (err: any) {
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
    this._convertParamsToObjectId(params);
    const controllerData = {
      currentAPIUser,
      routeData: { params, body, query: decodedQuery, endpointPath: path },
    };
    const usecaseRes = await this._usecase.makeRequest(controllerData);
    return usecaseRes;
  };

  private _convertParamsToObjectId = (params: StringKeyObject): void => {
    for (const property in params) {
      const value = params[property];
      const endsWithIdRegex = /id$/i;
      const isObjectId = property.match(endsWithIdRegex) && value.length === 24;
      if (isObjectId) {
        params[property] = this._convertStringToObjectId(value);
      }
    }
  };

  public init = async (props: {
    makeUsecase: Promise<IUsecase<any, UsecaseResponse, any>>;
    makeQueryStringHandler: QueryStringHandler;
    convertStringToObjectId: any;
  }): Promise<this> => {
    const { makeUsecase, makeQueryStringHandler, convertStringToObjectId } = props;
    this._usecase = await makeUsecase;
    this._queryStringHandler = makeQueryStringHandler;
    this._convertStringToObjectId = convertStringToObjectId;
    return this;
  };
}

export { AbstractController, ControllerParams };
