"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = exports.makeStripePaymentService = void 0;
const stripe_1 = require("stripe");
const constants_1 = require("../../../../constants");
const stripePaymentService_1 = require("./stripePaymentService");
let stripeKey = constants_1.STRIPE_SECRET_KEY;
if (!constants_1.IS_PRODUCTION) {
    stripeKey = constants_1.STRIPE_SECRET_KEY_DEV;
}
const stripe = new stripe_1.Stripe(stripeKey, {
    apiVersion: '2020-08-27',
    typescript: true,
});
exports.stripe = stripe;
const makeStripePaymentService = new stripePaymentService_1.StripePaymentService().init({ paymentLib: stripe });
exports.makeStripePaymentService = makeStripePaymentService;
