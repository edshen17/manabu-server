"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateStripeWebhookUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const stub_1 = require("../../../dataAccess/services/stub");
const stripe_1 = require("../../../payment/services/stripe");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/base/query");
const webhookHandler_1 = require("../../utils/webhookHandler");
const createStripeWebhookUsecase_1 = require("./createStripeWebhookUsecase");
const makeCreateStripeWebhookUsecase = new createStripeWebhookUsecase_1.CreateStripeWebhookUsecase().init({
    makeDbService: stub_1.makeStubDbService,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
    stripe: stripe_1.stripe,
    makeWebhookHandler: webhookHandler_1.makeWebhookHandler,
});
exports.makeCreateStripeWebhookUsecase = makeCreateStripeWebhookUsecase;
