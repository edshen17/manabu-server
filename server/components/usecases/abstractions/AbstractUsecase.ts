import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { AbstractParamsValidator } from '../../validators/abstractions/AbstractParamsValidator';
import { AbstractQueryValidator } from '../../validators/abstractions/AbstractQueryValidator';
import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerData, IUsecase, UsecaseInitParams } from './IUsecase';

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
    const makeRequestTemplateParams = this._getMakeRequestTemplateParams(controllerData);
    const { isValidRequest } = makeRequestTemplateParams;
    if (isValidRequest) {
      const usecaseRes = await this._makeRequestTemplate(makeRequestTemplateParams);
      return usecaseRes;
    } else {
      throw new Error(this._makeRequestErrorMsg);
    }
  };

  protected _getMakeRequestTemplateParams = (
    controllerData: ControllerData
  ): MakeRequestTemplateParams => {
    const { routeData, currentAPIUser, endpointPath } = controllerData;
    const { body, params, query } = routeData;
    const isCurrentAPIUserPermitted = this._isCurrentAPIUserPermitted({
      params,
      currentAPIUser,
      endpointPath,
    });
    const isSelf = this._isSelf({ params, currentAPIUser, endpointPath });
    const isValidRequest = this._isValidRequest(controllerData);
    const dbServiceAccessOptions = this._getDbServiceAccessOptions({
      isCurrentAPIUserPermitted,
      currentAPIUser,
      isSelf,
    });
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
      isSelf,
    };
    return makeRequestTemplateParams;
  };

  protected _isCurrentAPIUserPermitted = (props: {
    params: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean => {
    const { params, currentAPIUser, endpointPath } = props;
    const isAdmin = currentAPIUser.role == 'admin';
    const isSelf = this._isSelf({ params, currentAPIUser, endpointPath });
    const isLoginProtected = this._isLoginProtected();
    const isLoggedIn = this._isLoggedIn(currentAPIUser);
    const isCurrentAPIUserPermitted =
      isSelf || isAdmin || !isLoginProtected || (isSelf && isLoginProtected && isLoggedIn);
    return isCurrentAPIUserPermitted;
  };

  protected _isSelf = (props: {
    params: any;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
  }): boolean => {
    const { params, currentAPIUser, endpointPath } = props;
    const isSameUserId: boolean =
      params.userId && currentAPIUser.userId && params.userId == currentAPIUser.userId;
    const isSameTeacherId: boolean =
      params.teacherId && currentAPIUser.teacherId && params.teacherId == currentAPIUser.teacherId;
    const isSelfRoute = endpointPath.includes('self');
    const isAdmin = currentAPIUser.role == 'admin';
    const isSelf = isSameUserId || isSameTeacherId || isSelfRoute || isAdmin;
    return isSelf;
  };

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    const { endpointPath, routeData, currentAPIUser } = controllerData;
    const { params } = routeData;
    const isCurrentAPIUserPermitted = this._isCurrentAPIUserPermitted({
      endpointPath,
      currentAPIUser,
      params,
    });
    const isValidRouteData = this._isValidRouteData(controllerData);
    const isValidRequest = isCurrentAPIUserPermitted && isValidRouteData;
    return isValidRequest;
  };

  private _getDbServiceAccessOptions = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    isSelf: boolean;
  }) => {
    const { currentAPIUser, isCurrentAPIUserPermitted, isSelf } = props;
    const dbServiceAccessOptions: DbServiceAccessOptions = {
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf,
    };
    return dbServiceAccessOptions;
  };

  protected abstract _makeRequestTemplate(
    props: MakeRequestTemplateParams
  ): Promise<UsecaseResponse>;

  protected _isValidRouteData = (controllerData: ControllerData): boolean => {
    const { routeData } = controllerData;
    let isValidRouteData: boolean;
    try {
      const { query, params } = routeData;
      this._queryValidator.validate({ query });
      this._paramsValidator.validate({ params });
      this._isValidRouteDataTemplate(controllerData);
      isValidRouteData = true;
    } catch (err) {
      isValidRouteData = false;
    }
    return isValidRouteData;
  };

  protected _isValidRouteDataTemplate = (controllerData: ControllerData): void => {};

  private _isLoggedIn = (currentAPIUser: CurrentAPIUser): boolean => {
    const isLoggedIn = currentAPIUser.userId ? true : false;
    return isLoggedIn;
  };

  protected _isLoginProtected = (): boolean => {
    return true;
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
