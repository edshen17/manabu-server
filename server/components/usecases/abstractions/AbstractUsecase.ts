import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { ControllerData, IUsecase } from './IUsecase';

abstract class AbstractUsecase<UsecaseResponse> implements IUsecase<UsecaseResponse> {
  private makeRequestErrorMsg: string;
  constructor(makeRequestErrorMsg: string) {
    this.makeRequestErrorMsg = makeRequestErrorMsg;
  }
  protected _isCurrentAPIUserPermitted(props: {
    params: any;
    query?: any;
    currentAPIUser: any;
  }): boolean {
    const { params, currentAPIUser } = props;
    return params.uId == currentAPIUser.userId || currentAPIUser.role == 'admin';
  }

  protected abstract _setAccessOptions(props: {
    currentAPIUser: any;
    isCurrentAPIUserPermitted: boolean;
    params: any;
  }): AccessOptions;

  protected abstract _isValidRequest(controllerData: ControllerData): boolean;

  protected _makeRequestSetupTemplate = (controllerData: ControllerData) => {
    const { routeData, currentAPIUser } = controllerData;
    const { body, params, query } = routeData;
    const isCurrentAPIUserPermitted = this._isCurrentAPIUserPermitted({
      params,
      query,
      currentAPIUser,
    });

    const accessOptions: AccessOptions = this._setAccessOptions({
      isCurrentAPIUserPermitted,
      currentAPIUser,
      params,
    });
    const isValidRequest = this._isValidRequest(controllerData);
    return { accessOptions, body, isValidRequest, isCurrentAPIUserPermitted, params, query };
  };

  protected abstract _makeRequestTemplate(props: {
    params: any;
    body: any;
    accessOptions: AccessOptions;
    query?: any;
  }): Promise<UsecaseResponse>;

  public makeRequest = async (controllerData: ControllerData): Promise<UsecaseResponse> => {
    const { accessOptions, body, isValidRequest, params, query } =
      this._makeRequestSetupTemplate(controllerData);

    if (isValidRequest) {
      return await this._makeRequestTemplate({ params, body, accessOptions, query });
    } else {
      throw new Error(this.makeRequestErrorMsg);
    }
  };
  abstract init(services: any): Promise<this>;
}

export { AbstractUsecase };
