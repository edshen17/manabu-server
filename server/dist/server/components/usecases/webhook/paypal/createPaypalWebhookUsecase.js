"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePaypalWebhookUsecase = void 0;
const AbstractCreateUsecase_1 = require("../../abstractions/AbstractCreateUsecase");
class CreatePaypalWebhookUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _webhookHandler;
    _isProtectedResource = () => {
        return false;
    };
    _makeRequestTemplate = async (props) => {
        const { body, currentAPIUser } = props;
        const { event_type, resource, id } = body;
        const { transactions } = resource;
        const token = transactions[0].custom;
        const paymentId = id;
        let usecaseRes = {};
        switch (event_type) {
            case 'PAYMENTS.PAYMENT.CREATED':
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
exports.CreatePaypalWebhookUsecase = CreatePaypalWebhookUsecase;
