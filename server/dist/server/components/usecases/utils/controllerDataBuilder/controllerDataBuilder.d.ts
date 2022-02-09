import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerData, RouteData } from '../../abstractions/IUsecase';
declare class ControllerDataBuilder {
    private _currentAPIUser;
    private _routeData;
    constructor();
    private _setDefaultProperties;
    currentAPIUser: (currentAPIUser: CurrentAPIUser) => this;
    routeData: (routeData: RouteData) => this;
    build: () => ControllerData;
}
export { ControllerDataBuilder };
