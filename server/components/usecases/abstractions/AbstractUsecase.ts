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

abstract class AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse>
  implements IUsecase<OptionalUsecaseInitParams, UsecaseResponse>
{
  protected _queryValidator!: AbstractQueryValidator;
  protected _paramsValidator!: AbstractParamsValidator;
  protected _cloneDeep!: any;
  protected _deepEqual!: any;
  protected _resourceAccessData: StringKeyObject = {
    hasResourceAccessCheck: false,
    paramIdName: '',
  };
  protected _dbService!: IDbService<any, any>;

  public makeRequest = async (controllerData: ControllerData): Promise<UsecaseResponse> => {
    const makeRequestTemplateParams = await this._getMakeRequestTemplateParams(controllerData);
    const usecaseRes = await this._makeRequestTemplate(makeRequestTemplateParams);
    return usecaseRes;
  };

  protected _getMakeRequestTemplateParams = async (
    controllerData: ControllerData
  ): Promise<MakeRequestTemplateParams> => {
    const { routeData, currentAPIUser, endpointPath } = controllerData;
    const { body, params, query } = routeData;
    const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
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
    const isProtectedResource = this._isProtectedResource();
    const isCurrentAPIUserPermitted = isSelf || isAdmin || !isProtectedResource;
    return isCurrentAPIUserPermitted;
  };

  protected _isSelf = async (props: {
    params: any;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
  }): Promise<boolean> => {
    const { params, currentAPIUser, endpointPath } = props;
    const isSameUserId: boolean =
      params.userId && currentAPIUser.userId && params.userId == currentAPIUser.userId;
    const isSameTeacherId: boolean =
      params.teacherId && currentAPIUser.teacherId && params.teacherId == currentAPIUser.teacherId;
    const isSelfRoute = endpointPath.includes('self');
    const isAdmin = currentAPIUser.role == 'admin';
    const isResourceOwner = await this._isResourceOwner({ currentAPIUser, params });
    const isSelf = isSameUserId || isSameTeacherId || isSelfRoute || isAdmin || isResourceOwner;
    return isSelf;
  };

  private _isResourceOwner = async (props: {
    currentAPIUser: CurrentAPIUser;
    params: any;
  }): Promise<boolean> => {
    const { currentAPIUser, params } = props;
    const { userId } = currentAPIUser;
    const { hasResourceAccessCheck, paramIdName } = this._resourceAccessData;
    let isResourceOwner = false;
    if (hasResourceAccessCheck) {
      const resourceId = params[`${paramIdName}`];
      const dbServiceAccessOptions = this._dbService.getBaseDbServiceAccessOptions();
      const resourceData = await this._dbService.findById({
        _id: resourceId,
        dbServiceAccessOptions,
      });
      for (const property in resourceData) {
        const value = resourceData[property];
        isResourceOwner = isResourceOwner || this._deepEqual(value, userId);
      }
    }
    return isResourceOwner;
  };

  private _isLoggedIn = (currentAPIUser: CurrentAPIUser): boolean => {
    const isLoggedIn = currentAPIUser.userId ? true : false;
    return isLoggedIn;
  };

  protected _isProtectedResource = (): boolean => {
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
    const { query, params } = routeData;
    this._queryValidator.validate({ query });
    this._paramsValidator.validate({ params });
    this._isValidRouteDataTemplate(controllerData);
    return true;
  };

  protected _isValidRouteDataTemplate = (controllerData: ControllerData): void => {};

  public init = async (initParams: UsecaseInitParams<OptionalUsecaseInitParams>): Promise<this> => {
    const {
      makeQueryValidator,
      makeParamsValidator,
      cloneDeep,
      makeDbService,
      deepEqual,
      ...optionalInitParams
    } = initParams;
    this._queryValidator = makeQueryValidator;
    this._paramsValidator = makeParamsValidator;
    this._cloneDeep = cloneDeep;
    this._deepEqual = deepEqual;
    this._dbService = await makeDbService;
    await this._initTemplate(optionalInitParams);
    return this;
  };

  protected _initTemplate = (
    optionalInitParams: Omit<
      UsecaseInitParams<OptionalUsecaseInitParams>,
      'makeQueryValidator' | 'makeParamsValidator' | 'cloneDeep' | 'makeDbService' | 'deepEqual'
    >
  ): Promise<void> | void => {};
}

export { AbstractUsecase, MakeRequestTemplateParams };
