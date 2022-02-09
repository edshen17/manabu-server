"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripePaymentService = void 0;
const AbstractPaymentService_1 = require("../../abstractions/AbstractPaymentService");
class StripePaymentService extends AbstractPaymentService_1.AbstractPaymentService {
    _createPaymentJson = (props) => {
        const { successRedirectUrl, cancelRedirectUrl, items, token } = props;
        const createPaymentJson = {
            line_items: items,
            payment_method_types: ['card', 'wechat_pay', 'grabpay', 'alipay'],
            mode: 'payment',
            success_url: successRedirectUrl,
            cancel_url: cancelRedirectUrl,
            payment_method_options: {
                wechat_pay: {
                    client: 'web',
                },
            },
            payment_intent_data: {
                metadata: { token },
            },
        };
        return createPaymentJson;
    };
    _executePaymentTemplate = async (createPaymentJson) => {
        const session = await this._paymentLib.checkout.sessions.create(createPaymentJson);
        const executePaymentRes = { redirectUrl: session.url };
        return executePaymentRes;
    };
    _createPayoutJson = (props) => {
        return {};
    };
    _executePayoutTemplate = async (createPayoutJson) => {
        return {
            id: '',
        };
    };
}
exports.StripePaymentService = StripePaymentService;
