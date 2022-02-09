"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateStripeWebhookUsecase = void 0;
const constants_1 = require("../../../../constants");
const AbstractCreateUsecase_1 = require("../../abstractions/AbstractCreateUsecase");
class CreateStripeWebhookUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _stripe;
    _webhookHandler;
    _isProtectedResource = () => {
        return false;
    };
    _makeRequestTemplate = async (props) => {
        const { rawBody, headers, currentAPIUser } = props;
        const stripeEvent = this._getStripeEvent({ rawBody, headers });
        const stripeEventType = stripeEvent.type;
        const stripeEventObj = stripeEvent.data.object;
        const token = stripeEventObj.charges.data[0].metadata.token;
        const paymentId = stripeEventObj.id;
        let usecaseRes = {};
        switch (stripeEventType) {
            case 'payment_intent.succeeded':
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
    _getStripeEvent = (props) => {
        const { headers, rawBody } = props;
        const { payloadString } = rawBody || {};
        const sig = headers['stripe-signature'];
        let webhookSecret = constants_1.STRIPE_WEBHOOK_SECREY_KEY_DEV;
        let constructEventBody = payloadString || rawBody;
        if (constants_1.IS_PRODUCTION) {
            webhookSecret = constants_1.STRIPE_WEBHOOK_SECREY_KEY;
            constructEventBody = rawBody;
        }
        const event = this._stripe.webhooks.constructEvent(constructEventBody, sig, webhookSecret);
        return event;
    };
    _initTemplate = async (optionalInitParams) => {
        const { stripe, makeWebhookHandler } = optionalInitParams;
        this._stripe = stripe;
        this._webhookHandler = await makeWebhookHandler;
    };
}
exports.CreateStripeWebhookUsecase = CreateStripeWebhookUsecase;
