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

abstract class AbstractUsecase<UsecaseResponse> implements IUsecase<UsecaseResponse> {
  private _makeRequestErrorMsg: string;
  constructor(makeRequestErrorMsg: string) {
    this._makeRequestErrorMsg = makeRequestErrorMsg;
  }

  public makeRequest = async (controllerData: ControllerData): Promise<UsecaseResponse> => {
    const setUpProps = this._makeRequestSetupTemplate(controllerData);
    const { isValidRequest } = setUpProps;

    if (isValidRequest) {
      return await this._makeRequestTemplate(setUpProps);
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

    const dbServiceAccessOptions: DbServiceAccessOptions = this._setAccessOptions({
      isCurrentAPIUserPermitted,
      currentAPIUser,
      params,
      endpointPath,
    });
    const isValidRequest = this._isValidRequest(controllerData);
    return {
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
  };

  protected _isCurrentAPIUserPermitted = (props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean => {
    const { params, currentAPIUser } = props;
    return (
      (params.uId && currentAPIUser.userId && params.uId) == currentAPIUser.userId ||
      currentAPIUser.role == 'admin'
    );
  };

  protected _setAccessOptions = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    params: any;
    endpointPath: string;
  }): DbServiceAccessOptions => {
    const dbServiceAccessOptions = this._setAccessOptionsTemplate(props);
    return dbServiceAccessOptions;
  };

  protected _setAccessOptionsTemplate = (props: {
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

  abstract init(services: any): Promise<this>;
}

export { AbstractUsecase, MakeRequestTemplateParams };
