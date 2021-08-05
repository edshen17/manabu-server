import { DbServiceAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';
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

abstract class AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbService>
  implements IUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbService>
{
  protected _queryValidator!: AbstractQueryValidator;
  protected _paramsValidator!: AbstractParamsValidator;
  protected _cloneDeep!: any;
  protected _hasResourceOwnerCheck: boolean = false;
  protected _dbService!: DbService;
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
    const isSelf = this._isSelf({ params, currentAPIUser, endpointPath });
    const isCurrentAPIUserPermitted = this._isCurrentAPIUserPermitted({
      isSelf,
      currentAPIUser,
    });
    const isValidRequest = this._isValidRequest({ controllerData, isSelf });
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
    isSelf: boolean;
    currentAPIUser: CurrentAPIUser;
  }): boolean => {
    const { isSelf, currentAPIUser } = props;
    const isAdmin = currentAPIUser.role == 'admin';
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

  private _isResourceOwner = () => {};

  private _isLoggedIn = (currentAPIUser: CurrentAPIUser): boolean => {
    const isLoggedIn = currentAPIUser.userId ? true : false;
    return isLoggedIn;
  };

  protected _isLoginProtected = (): boolean => {
    return true;
  };

  protected _isValidRequest = (props: {
    controllerData: ControllerData;
    isSelf: boolean;
  }): boolean => {
    const { controllerData, isSelf } = props;
    const { currentAPIUser } = controllerData;
    const isCurrentAPIUserPermitted = this._isCurrentAPIUserPermitted({
      isSelf,
      currentAPIUser,
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

  public init = async (
    initParams: UsecaseInitParams<OptionalUsecaseInitParams, DbService>
  ): Promise<this> => {
    const {
      makeQueryValidator,
      makeParamsValidator,
      cloneDeep,
      makeDbService,
      ...optionalInitParams
    } = initParams;
    this._queryValidator = makeQueryValidator;
    this._paramsValidator = makeParamsValidator;
    this._cloneDeep = cloneDeep;
    this._dbService = await makeDbService;
    await this._initTemplate(optionalInitParams);
    return this;
  };

  protected _initTemplate = (
    optionalInitParams: Omit<
      UsecaseInitParams<OptionalUsecaseInitParams, DbService>,
      'makeQueryValidator' | 'makeParamsValidator' | 'cloneDeep' | 'makeDbService'
    >
  ): Promise<void> | void => {};
}

export { AbstractUsecase, MakeRequestTemplateParams };
