"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookHandler = void 0;
const IDbService_1 = require("../../../dataAccess/abstractions/IDbService");
class WebhookHandler {
    _controllerDataBuilder;
    _createPackageTransactionUsecase;
    _convertStringToObjectId;
    createResource = async (props) => {
        const { token } = props;
        const tokenArr = token.split('-');
        const userId = this._convertStringToObjectId(tokenArr[0]);
        const resourceName = tokenArr[1];
        let usecaseRes = {};
        switch (resourceName) {
            case IDbService_1.DB_SERVICE_COLLECTION.PACKAGE_TRANSACTIONS:
                usecaseRes = await this._createPackageTransaction({ ...props, userId });
                break;
            default:
                break;
        }
        return usecaseRes;
    };
    _createPackageTransaction = async (props) => {
        const { currentAPIUser, token, userId, paymentId } = props;
        currentAPIUser.userId = userId;
        const controllerData = this._controllerDataBuilder
            .currentAPIUser(currentAPIUser)
            .routeData({
            query: {
                token,
                paymentId,
            },
            headers: {},
            body: {},
            params: {},
            endpointPath: '',
            rawBody: {},
        })
            .build();
        const createPackageTransactionUsecaseRes = await this._createPackageTransactionUsecase.makeRequest(controllerData);
        return createPackageTransactionUsecaseRes;
    };
    init = async (initParams) => {
        const { makeCreatePackageTransactionUsecase, makeControllerDataBuilder, convertStringToObjectId, } = initParams;
        this._createPackageTransactionUsecase = await makeCreatePackageTransactionUsecase;
        this._controllerDataBuilder = makeControllerDataBuilder;
        this._convertStringToObjectId = convertStringToObjectId;
        return this;
    };
}
exports.WebhookHandler = WebhookHandler;
