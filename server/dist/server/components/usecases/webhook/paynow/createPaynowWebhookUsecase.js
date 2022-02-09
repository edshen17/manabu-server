"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaynowWebhookUsecase = void 0;
const AbstractCreateUsecase_1 = require("../../abstractions/AbstractCreateUsecase");
class CreatePaynowWebhookUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _webhookHandler;
    _isProtectedResource = () => {
        return false;
    };
    _makeRequestTemplate = async (props) => {
        const { body, currentAPIUser } = props;
        const { key, data } = body;
        const { metadata, id } = data;
        const { token } = metadata;
        const paymentId = id;
        let usecaseRes = {};
        switch (key) {
            case 'charge.complete':
                usecaseRes = await this._webhookHandler.createResource({
                    currentAPIUser,
                    token,
                    paymentId,
                });
                break;
            default:
                break;
        }
        return usecaseRes;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeWebhookHandler } = optionalInitParams;
        this._webhookHandler = await makeWebhookHandler;
    };
}
exports.CreatePaynowWebhookUsecase = CreatePaynowWebhookUsecase;
