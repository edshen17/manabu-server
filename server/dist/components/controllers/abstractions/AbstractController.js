"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractController = void 0;
class AbstractController {
    constructor(props) {
        this._awaitUsecaseRes = async (httpRequest) => {
            const { currentAPIUser, path, params, body } = httpRequest;
            const controllerData = {
                currentAPIUser,
                endpointPath: path,
                routeData: { params, body },
            };
            const usecaseRes = await this.usecase.makeRequest(controllerData);
            return usecaseRes;
        };
        this.makeRequest = async (httpRequest) => {
            const headers = {
                'Content-Type': 'application/json',
            };
            try {
                const usecaseRes = await this._awaitUsecaseRes(httpRequest);
                return {
                    headers,
                    statusCode: this.successStatusCode,
                    body: usecaseRes,
                };
            }
            catch (err) {
                return {
                    headers,
                    statusCode: this.errorStatusCode,
                    body: {
                        error: err.message,
                    },
                };
            }
        };
        this.init = async (props) => {
            const { makeUsecase } = props;
            this.usecase = await makeUsecase;
            return this;
        };
        const { successStatusCode, errorStatusCode } = props;
        this.successStatusCode = successStatusCode;
        this.errorStatusCode = errorStatusCode;
    }
}
exports.AbstractController = AbstractController;
