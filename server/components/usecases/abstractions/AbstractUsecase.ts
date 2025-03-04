import { ObjectId } from 'mongoose';
import { StringKeyObject } from '../../../types/custom';
import { DbServiceAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';
import { AbstractParamsValidator } from '../../validators/abstractions/AbstractParamsValidator';
import { AbstractQueryValidator } from '../../validators/abstractions/AbstractQueryValidator';
import { CurrentAPIUser } from '../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerData, IUsecase, UsecaseInitParams } from './IUsecase';

type MakeRequestTemplateParams = {
  dbServiceAccessOptions: DbServiceAccessOptions;
  body: any;
  rawBody: any;
  isValidRequest: boolean;
  isCurrentAPIUserPermitted: boolean;
  params: any;
  query: any;
  endpointPath: string;
  currentAPIUser: CurrentAPIUser;
  controllerData: ControllerData;
  headers: any;
  cookies: any;
  req: any;
};

type IsCurrentAPIUserPermittedParams = {
  isSelf: boolean;
  currentAPIUser: CurrentAPIUser;
  endpointPath: string;
};

abstract class AbstractUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse>
  implements IUsecase<OptionalUsecaseInitParams, UsecaseResponse, DbServiceResponse>
{
  protected _queryValidator!: AbstractQueryValidator;
  protected _paramsValidator!: AbstractParamsValidator;
  protected _cloneDeep!: any;
  protected _deepEqual!: any;
  protected _dbService!: IDbService<any, DbServiceResponse>;

  public makeRequest = async (controllerData: ControllerData): Promise<UsecaseResponse> => {
    const makeRequestTemplateParams = await this._getMakeRequestTemplateParams(controllerData);
    const usecaseRes = await this._makeRequestTemplate(makeRequestTemplateParams);
    return usecaseRes;
  };

  private _getMakeRequestTemplateParams = async (
    controllerData: ControllerData
  ): Promise<MakeRequestTemplateParams> => {
    const { routeData, currentAPIUser } = controllerData;
    const { body, params, query, endpointPath, headers, rawBody, cookies, req } = routeData;
    const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
    const isCurrentAPIUserPermitted = this._isCurrentAPIUserPermitted({
      isSelf,
      currentAPIUser,
      endpointPath,
    });
    const isValidRequest = this._isValidRequest({ controllerData, isSelf, endpointPath });
    const dbServiceAccessOptions = this._getDbServiceAccessOptions({
      isCurrentAPIUserPermitted,
      currentAPIUser,
      isSelf,
    });
    const makeRequestTemplateParams = {
      dbServiceAccessOptions,
      rawBody,
      body,
      isValidRequest,
      isCurrentAPIUserPermitted,
      params,
      query,
      endpointPath,
      currentAPIUser,
      controllerData,
      isSelf,
      headers,
      cookies,
      req,
    };
    return makeRequestTemplateParams;
  };

  private _isCurrentAPIUserPermitted = (props: IsCurrentAPIUserPermittedParams): boolean => {
    const { isSelf, currentAPIUser, endpointPath } = props;
    const isAdminProtected = endpointPath.includes('admin');
    const isAdmin = currentAPIUser.role == 'admin';
    const isProtectedResource = this._isProtectedResource(props);
    const isCurrentAPIUserPermitted = isAdminProtected
      ? isAdmin
      : isSelf || isAdmin || !isProtectedResource;
    return isCurrentAPIUserPermitted;
  };

  protected _isSelf = async (props: {
    params: any;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
  }): Promise<boolean> => {
    const { params, currentAPIUser, endpointPath } = props;
    const isSameUserId: boolean =
      params.userId && currentAPIUser.userId && params.userId == currentAPIUser.userId.toString();
    const isSameTeacherId: boolean =
      params.teacherId &&
      currentAPIUser.teacherId &&
      params.teacherId == currentAPIUser.teacherId.toString();
    const isSelfRoute = endpointPath.includes('self');
    const isResourceOwner = await this._isResourceOwner({ currentAPIUser, params });
    const isSelf = isSameUserId || isSameTeacherId || isSelfRoute || isResourceOwner;
    return isSelf;
  };

  private _isResourceOwner = async (props: {
    currentAPIUser: CurrentAPIUser;
    params: any;
  }): Promise<boolean> => {
    const { currentAPIUser, params } = props;
    const { userId } = currentAPIUser;
    const { hasResourceAccessCheck, paramIdName } = this._getResourceAccessData();
    let isResourceOwner = false;
    if (hasResourceAccessCheck) {
      const resourceId = params[`${paramIdName}`];
      const dbServiceAccessOptions = this._dbService.getOverrideDbServiceAccessOptions();
      dbServiceAccessOptions.isReturningParent = true;
      const resourceData = await this._dbService.findById({
        _id: resourceId,
        dbServiceAccessOptions,
      });
      isResourceOwner = this._processResourceOwnership({ resourceData, userId });
    }
    return isResourceOwner;
  };

  protected _getResourceAccessData = (): StringKeyObject => {
    return {
      hasResourceAccessCheck: false,
      paramIdName: '',
    };
  };

  private _processResourceOwnership = (props: {
    resourceData: StringKeyObject;
    userId?: ObjectId | string;
  }): boolean => {
    const { resourceData, userId } = props;
    let isResourceOwner = false;
    for (const property in resourceData) {
      const value = resourceData[property];
      const isObject = !value && value.constructor === Object;
      const isArray = Array.isArray(value);
      if (isObject) {
        this._processResourceOwnership({ resourceData: value, userId });
      } else if (isArray) {
        value.map((embeddedObj: any) => {
          isResourceOwner =
            isResourceOwner ||
            this._processResourceOwnership({ resourceData: embeddedObj, userId });
        });
      } else {
        isResourceOwner = isResourceOwner || value.toString() == userId;
      }
    }
    return isResourceOwner;
  };

  protected _isProtectedResource = (props: IsCurrentAPIUserPermittedParams): boolean => {
    return true;
  };

  private _isValidRequest = (props: {
    controllerData: ControllerData;
    isSelf: boolean;
    endpointPath: string;
  }): boolean => {
    const { controllerData, isSelf, endpointPath } = props;
    const { currentAPIUser } = controllerData;
    const isCurrentAPIUserPermitted = this._isCurrentAPIUserPermitted({
      isSelf,
      currentAPIUser,
      endpointPath,
    });
    const isValidRouteData = this._isValidRouteData(controllerData);
    const isValidRequest = isCurrentAPIUserPermitted && isValidRouteData;
    return isValidRequest;
  };

  private _getDbServiceAccessOptions = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    isSelf: boolean;
  }): DbServiceAccessOptions => {
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

  private _isValidRouteData = (controllerData: ControllerData): boolean => {
    const { routeData } = controllerData;
    const { query, params } = routeData;
    this._queryValidator.validate({ query });
    this._paramsValidator.validate({ params });
    this._isValidRouteDataTemplate(controllerData);
    return true;
  };

  protected _isValidRouteDataTemplate = (controllerData: ControllerData): void => {
    return;
  };

  public init = async (
    initParams: UsecaseInitParams<OptionalUsecaseInitParams, DbServiceResponse>
  ): Promise<this> => {
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
      UsecaseInitParams<OptionalUsecaseInitParams, DbServiceResponse>,
      'makeQueryValidator' | 'makeParamsValidator' | 'cloneDeep' | 'makeDbService' | 'deepEqual'
    >
  ): Promise<void> | void => {
    return;
  };
}

export { AbstractUsecase, MakeRequestTemplateParams, IsCurrentAPIUserPermittedParams };
