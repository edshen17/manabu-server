"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerDataBuilder = void 0;
class ControllerDataBuilder {
    _currentAPIUser;
    _routeData;
    constructor() {
        this._setDefaultProperties();
    }
    _setDefaultProperties = () => {
        this._currentAPIUser = {
            userId: undefined,
            role: 'user',
        };
        this._routeData = {
            params: {},
            body: {},
            query: {},
            endpointPath: '',
            headers: {},
            rawBody: {},
        };
    };
    currentAPIUser = (currentAPIUser) => {
        this._currentAPIUser = currentAPIUser;
        return this;
    };
    routeData = (routeData) => {
        this._routeData = routeData;
        return this;
    };
    build = () => {
        const controllerData = {
            currentAPIUser: this._currentAPIUser,
            routeData: this._routeData,
        };
        this._setDefaultProperties();
        return controllerData;
    };
}
exports.ControllerDataBuilder = ControllerDataBuilder;
