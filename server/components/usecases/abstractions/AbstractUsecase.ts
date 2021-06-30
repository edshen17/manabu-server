import { DbServiceAccessOptions } from '../../dataAccess/abstractions/IDbService';
import { ControllerData, CurrentAPIUser, IUsecase } from './IUsecase';

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

abstract class AbstractUsecase<UsecaseInitParams, UsecaseResponse>
  implements IUsecase<UsecaseInitParams, UsecaseResponse>
{
  private _makeRequestErrorMsg: string;
  constructor(makeRequestErrorMsg: string) {
    this._makeRequestErrorMsg = makeRequestErrorMsg;
  }

  public makeRequest = async (controllerData: ControllerData): Promise<UsecaseResponse> => {
    const setUpProps = this._makeRequestSetupTemplate(controllerData);
    const { isValidRequest } = setUpProps;

    if (isValidRequest) {
      const usecaseResponse = await this._makeRequestTemplate(setUpProps);
      return usecaseResponse;
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
    const dbServiceAccessOptions: DbServiceAccessOptions = this._getDbServiceAccessOptions({
      isCurrentAPIUserPermitted,
      currentAPIUser,
      params,
      endpointPath,
    });
    const isValidRequest = this._isValidRequest(controllerData);
    const setUpProps = {
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
    return setUpProps;
  };

  protected _isCurrentAPIUserPermitted = (props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean => {
    const { params, currentAPIUser } = props;
    const isCurrentAPIUserPermitted =
      (params.uId && currentAPIUser.userId && params.uId) == currentAPIUser.userId ||
      currentAPIUser.role == 'admin';
    return isCurrentAPIUserPermitted;
  };

  protected _getDbServiceAccessOptions = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    params: any;
    endpointPath: string;
  }): DbServiceAccessOptions => {
    const dbServiceAccessOptions = this._getDbServiceAccessOptionsTemplate(props);
    return dbServiceAccessOptions;
  };

  protected _getDbServiceAccessOptionsTemplate = (props: {
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
      isSelf: params.uId && currentAPIUser.userId && params.uId == currentAPIUser.userId,
    };
    return dbServiceAccessOptions;
  };

  protected abstract _isValidRequest(controllerData: ControllerData): boolean;

  protected abstract _makeRequestTemplate(
    props: MakeRequestTemplateParams
  ): Promise<UsecaseResponse>;

  abstract init(initParams: UsecaseInitParams): Promise<this>;
}

export { AbstractUsecase, MakeRequestTemplateParams };
