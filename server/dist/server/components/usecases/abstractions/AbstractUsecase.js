"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractUsecase = void 0;
class AbstractUsecase {
    _queryValidator;
    _paramsValidator;
    _cloneDeep;
    _deepEqual;
    _dbService;
    makeRequest = async (controllerData) => {
        const makeRequestTemplateParams = await this._getMakeRequestTemplateParams(controllerData);
        const usecaseRes = await this._makeRequestTemplate(makeRequestTemplateParams);
        return usecaseRes;
    };
    _getMakeRequestTemplateParams = async (controllerData) => {
        const { routeData, currentAPIUser } = controllerData;
        const { body, params, query, endpointPath, headers, rawBody } = routeData;
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
        };
        return makeRequestTemplateParams;
    };
    _isCurrentAPIUserPermitted = (props) => {
        const { isSelf, currentAPIUser, endpointPath } = props;
        const isAdminProtected = endpointPath.includes('admin');
        const isAdmin = currentAPIUser.role == 'admin';
        const isProtectedResource = this._isProtectedResource(props);
        const isCurrentAPIUserPermitted = isAdminProtected
            ? isAdmin
            : isSelf || isAdmin || !isProtectedResource;
        return isCurrentAPIUserPermitted;
    };
    _isSelf = async (props) => {
        const { params, currentAPIUser, endpointPath } = props;
        const isSameUserId = params.userId && currentAPIUser.userId && params.userId == currentAPIUser.userId.toString();
        const isSameTeacherId = params.teacherId &&
            currentAPIUser.teacherId &&
            params.teacherId == currentAPIUser.teacherId.toString();
        const isSelfRoute = endpointPath.includes('self');
        const isResourceOwner = await this._isResourceOwner({ currentAPIUser, params });
        const isSelf = isSameUserId || isSameTeacherId || isSelfRoute || isResourceOwner;
        return isSelf;
    };
    _isResourceOwner = async (props) => {
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
    _getResourceAccessData = () => {
        return {
            hasResourceAccessCheck: false,
            paramIdName: '',
        };
    };
    _processResourceOwnership = (props) => {
        const { resourceData, userId } = props;
        let isResourceOwner = false;
        for (const property in resourceData) {
            const value = resourceData[property];
            const isObject = !value && value.constructor === Object;
            const isArray = Array.isArray(value);
            if (isObject) {
                this._processResourceOwnership({ resourceData: value, userId });
            }
            else if (isArray) {
                value.map((embeddedObj) => {
                    isResourceOwner =
                        isResourceOwner ||
                            this._processResourceOwnership({ resourceData: embeddedObj, userId });
                });
            }
            else {
                isResourceOwner = isResourceOwner || value.toString() == userId;
            }
        }
        return isResourceOwner;
    };
    _isProtectedResource = (props) => {
        return true;
    };
    _isValidRequest = (props) => {
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
    _getDbServiceAccessOptions = (props) => {
        const { currentAPIUser, isCurrentAPIUserPermitted, isSelf } = props;
        const dbServiceAccessOptions = {
            isCurrentAPIUserPermitted,
            currentAPIUserRole: currentAPIUser.role,
            isSelf,
        };
        return dbServiceAccessOptions;
    };
    _isValidRouteData = (controllerData) => {
        const { routeData } = controllerData;
        const { query, params } = routeData;
        this._queryValidator.validate({ query });
        this._paramsValidator.validate({ params });
        this._isValidRouteDataTemplate(controllerData);
        return true;
    };
    _isValidRouteDataTemplate = (controllerData) => {
        return;
    };
    init = async (initParams) => {
        const { makeQueryValidator, makeParamsValidator, cloneDeep, makeDbService, deepEqual, ...optionalInitParams } = initParams;
        this._queryValidator = makeQueryValidator;
        this._paramsValidator = makeParamsValidator;
        this._cloneDeep = cloneDeep;
        this._deepEqual = deepEqual;
        this._dbService = await makeDbService;
        await this._initTemplate(optionalInitParams);
        return this;
    };
    _initTemplate = (optionalInitParams) => {
        return;
    };
}
exports.AbstractUsecase = AbstractUsecase;
