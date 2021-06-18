import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { ControllerData, CurrentAPIUser, IUsecase } from './IUsecase';

type MakeRequestTemplateParams = {
  accessOptions: AccessOptions;
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
  private makeRequestErrorMsg: string;
  constructor(makeRequestErrorMsg: string) {
    this.makeRequestErrorMsg = makeRequestErrorMsg;
  }

  public makeRequest = async (controllerData: ControllerData): Promise<UsecaseResponse> => {
    const setUpProps = this._makeRequestSetupTemplate(controllerData);
    const { isValidRequest } = setUpProps;

    if (isValidRequest) {
      return await this._makeRequestTemplate(setUpProps);
    } else {
      throw new Error(this.makeRequestErrorMsg);
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

    const accessOptions: AccessOptions = this._setAccessOptions({
      isCurrentAPIUserPermitted,
      currentAPIUser,
      params,
    });
    const isValidRequest = this._isValidRequest(controllerData);
    return {
      accessOptions,
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

  protected _isCurrentAPIUserPermitted(props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean {
    const { params, currentAPIUser } = props;
    return (
      (params.uId && currentAPIUser.userId && params.uId) == currentAPIUser.userId ||
      currentAPIUser.role == 'admin'
    );
  }

  protected _setAccessOptionsTemplate = (
    currentAPIUser: CurrentAPIUser,
    isCurrentAPIUserPermitted: boolean,
    params: any
  ) => {
    const accessOptions: AccessOptions = {
      isProtectedResource: true,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: params.uId && currentAPIUser.userId && params.uId == currentAPIUser.userId,
    };
    return accessOptions;
  };

  protected _setAccessOptions = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    params: any;
  }): AccessOptions => {
    const { currentAPIUser, isCurrentAPIUserPermitted, params } = props;
    const accessOptions = this._setAccessOptionsTemplate(
      currentAPIUser,
      isCurrentAPIUserPermitted,
      params
    );
    return accessOptions;
  };

  protected abstract _isValidRequest(controllerData: ControllerData): boolean;

  protected abstract _makeRequestTemplate(
    props: MakeRequestTemplateParams
  ): Promise<UsecaseResponse>;

  abstract init(services: any): Promise<this>;
}

export { AbstractUsecase, MakeRequestTemplateParams };
