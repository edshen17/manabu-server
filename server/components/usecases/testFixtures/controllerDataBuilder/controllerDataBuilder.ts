import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerData, RouteData } from '../../abstractions/IUsecase';

class ControllerDataBuilder {
  private _currentAPIUser!: CurrentAPIUser;
  private _endpointPath!: string;
  private _routeData!: RouteData;
  constructor() {
    this._setDefaultProperties();
  }

  private _setDefaultProperties = () => {
    this._currentAPIUser = {
      userId: undefined,
      role: 'user',
    };
    this._endpointPath = '';
    this._routeData = {
      params: {},
      body: {},
      query: {},
    };
  };

  public currentAPIUser = (currentAPIUser: CurrentAPIUser): this => {
    this._currentAPIUser = currentAPIUser;
    return this;
  };

  public endpointPath = (endpointPath: string): this => {
    this._endpointPath = endpointPath;
    return this;
  };

  public routeData = (routeData: RouteData): this => {
    this._routeData = routeData;
    return this;
  };

  public build = (): ControllerData => {
    const controllerData: ControllerData = {
      currentAPIUser: this._currentAPIUser,
      endpointPath: this._endpointPath,
      routeData: this._routeData,
    };
    this._setDefaultProperties();
    return controllerData;
  };
}

export { ControllerDataBuilder };
