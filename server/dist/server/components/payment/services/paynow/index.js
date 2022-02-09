"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.omise = exports.makePaynowPaymentService = void 0;
const constants_1 = require("../../../../constants");
const paynowPaymentService_1 = require("./paynowPaymentService");
// add production keys
const publicKey = constants_1.PAYNOW_PUBLIC_KEY_DEV;
const secretKey = constants_1.PAYNOW_SECRET_KEY_DEV;
const omise = require('omise')({
    publicKey,
    secretKey,
    omiseVersion: '2019-05-29',
});
exports.omise = omise;
const makePaynowPaymentService = new paynowPaymentService_1.PaynowPaymentService().init({ paymentLib: omise });
exports.makePaynowPaymentService = makePaynowPaymentService;
