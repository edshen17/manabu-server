"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePaypalPaymentService = void 0;
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
const constants_1 = require("../../../../constants");
const paypalPaymentService_1 = require("./paypalPaymentService");
const paypalConfig = {
    mode: 'sandbox',
    client_id: constants_1.PAYPAL_CLIENT_ID_DEV,
    client_secret: constants_1.PAYPAL_CLIENT_SECRET_DEV,
};
if (constants_1.IS_PRODUCTION) {
    paypalConfig.mode = 'live';
    paypalConfig.client_id = constants_1.PAYPAL_CLIENT_ID;
    paypalConfig.client_secret = constants_1.PAYPAL_CLIENT_SECRET;
}
paypal_rest_sdk_1.default.configure(paypalConfig);
const makePaypalPaymentService = new paypalPaymentService_1.PaypalPaymentService().init({ paymentLib: paypal_rest_sdk_1.default });
exports.makePaypalPaymentService = makePaypalPaymentService;
