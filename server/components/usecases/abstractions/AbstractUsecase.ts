import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { AbstractParamsValidator } from '../../validators/abstractions/AbstractParamsValidator';
import { AbstractQueryValidator } from '../../validators/abstractions/AbstractQueryValidator';
import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerData, IUsecase, RouteData, UsecaseInitParams } from './IUsecase';

type MakeRequestTemplateParams = {
  dbServiceAccessOptions: DbServiceAccessOptions;
  body: any;
  isValidRequest: boolean;
  isCurrentAPIUserPermitted: boolean;
  params: any;
  query: any;
  endpointPath: string;
  currentAPIUser: CurrentAPIUser;
  controllerData: ControllerData;
};

abstract class AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse>
  implements IUsecase<OptionalUsecaseInitParams, UsecaseResponse>
{
  protected _queryValidator!: AbstractQueryValidator;
  protected _paramsValidator!: AbstractParamsValidator;
  protected _cloneDeep!: any;
  private _makeRequestErrorMsg: string;
  constructor(makeRequestErrorMsg: string) {
    this._makeRequestErrorMsg = makeRequestErrorMsg;
  }

  public makeRequest = async (controllerData: ControllerData): Promise<UsecaseResponse> => {
    const makeRequestTemplateParams = this._makeRequestSetupTemplate(controllerData);
    const { isValidRequest } = makeRequestTemplateParams;

    if (isValidRequest) {
      const usecaseRes = await this._makeRequestTemplate(makeRequestTemplateParams);
      return usecaseRes;
    } else {
      throw new Error(this._makeRequestErrorMsg);
    }
  };

  protected _makeRequestSetupTemplate = (
    controllerData: ControllerData
  ): MakeRequestTemplateParams => {
    const { routeData, currentAPIUser, endpointPath } = controllerData;
    const { body, params, query } = routeData;
    const isCurrentAPIUserPermitted = this._isCurrentAPIUserPermitted({
      params,
      query,
      currentAPIUser,
      endpointPath,
    });
    const dbServiceAccessOptions = this._getDbServiceAccessOptions({
      isCurrentAPIUserPermitted,
      currentAPIUser,
      params,
      endpointPath,
    });
    const isValidRequest = this._isValidRequest(controllerData);
    const makeRequestTemplateParams = {
      dbServiceAccessOptions,
      body,
      isValidRequest,
      isCurrentAPIUserPermitted,
      params,
      query,
      endpointPath,
      currentAPIUser,
      controllerData,
    };
    return makeRequestTemplateParams;
  };

  protected _isCurrentAPIUserPermitted = (props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean => {
    const { params, currentAPIUser } = props;
    const isCurrentAPIUserPermitted =
      (params.uId && currentAPIUser.userId && params.uId == currentAPIUser.userId) ||
      (params.teacherId &&
        currentAPIUser.teacherId &&
        params.teacherId == currentAPIUser.teacherId) ||
      currentAPIUser.role == 'admin';
    return isCurrentAPIUserPermitted;
  };

  protected _getDbServiceAccessOptions = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    params: any;
    endpointPath: string;
  }) => {
    const { currentAPIUser, isCurrentAPIUserPermitted, params } = props;
    const dbServiceAccessOptions: DbServiceAccessOptions = {
      isProtectedResource: true,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf:
        (params.uId && currentAPIUser.userId && params.uId == currentAPIUser.userId) ||
        (params.teacherId &&
          currentAPIUser.teacherId &&
          params.teacherId == currentAPIUser.teacherId),
    };
    return dbServiceAccessOptions;
  };

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    const { routeData } = controllerData;
    const isValidRequest = this._isValidRouteData(routeData);
    return isValidRequest;
  };

  protected abstract _makeRequestTemplate(
    props: MakeRequestTemplateParams
  ): Promise<UsecaseResponse>;

  protected _isValidRouteData = (routeData: RouteData): boolean => {
    let isValidRouteData: boolean;
    try {
      const { query, params } = routeData;
      this._queryValidator.validate({ query });
      this._paramsValidator.validate({ params });
      isValidRouteData = true;
    } catch (err) {
      isValidRouteData = false;
    }
    return isValidRouteData;
  };

  public init = async (initParams: UsecaseInitParams<OptionalUsecaseInitParams>): Promise<this> => {
    const { makeQueryValidator, makeParamsValidator, cloneDeep, ...optionalInitParams } =
      initParams;
    this._queryValidator = makeQueryValidator;
    this._paramsValidator = makeParamsValidator;
    this._cloneDeep = cloneDeep;
    await this._initTemplate(optionalInitParams);
    return this;
  };

  protected _initTemplate = (
    optionalInitParams: Omit<
      UsecaseInitParams<OptionalUsecaseInitParams>,
      'makeQueryValidator' | 'makeParamsValidator' | 'cloneDeep'
    >
  ): Promise<void> | void => {};
}

export { AbstractUsecase, MakeRequestTemplateParams };
