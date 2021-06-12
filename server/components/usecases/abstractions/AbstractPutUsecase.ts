import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { ControllerData, IUsecase } from './IUsecase';

abstract class AbstractPutUsecase<UsecaseResponse> implements IUsecase<UsecaseResponse> {
  protected _isCurrentAPIUserPermitted(props: {
    params: any;
    query?: any;
    currentAPIUser: any;
  }): boolean {
    const { params, currentAPIUser } = props;
    return params.uId == currentAPIUser.userId || currentAPIUser.role == 'admin';
  }

  protected abstract _isValidBodyTemplate(body: any): boolean;

  protected _makeRequestSetupTemplate(controllerData: ControllerData) {
    const { routeData, currentAPIUser } = controllerData;
    const { body, params, query } = routeData;
    const isCurrentAPIUserPermitted = this._isCurrentAPIUserPermitted({
      params,
      query,
      currentAPIUser,
    });

    const accessOptions: AccessOptions = {
      isProtectedResource: true,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: params.uId == currentAPIUser.userId,
    };
    const isValidUpdate = currentAPIUser.role == 'admin' || this._isValidBodyTemplate(body);
    return { accessOptions, body, isValidUpdate, params, query };
  }

  protected abstract _makeRequestTemplate(props: {
    params: any;
    body: any;
    accessOptions: AccessOptions;
    query?: any;
  }): Promise<UsecaseResponse>;

  public async makeRequest(controllerData: ControllerData): Promise<UsecaseResponse> {
    const { isValidUpdate, params, body, accessOptions, query } =
      this._makeRequestSetupTemplate(controllerData);

    if (isValidUpdate) {
      return this._makeRequestTemplate({ params, body, accessOptions, query });
    } else {
      throw new Error('Access denied.');
    }
  }
  abstract init(services: any): Promise<this>;
}

export { AbstractPutUsecase };
