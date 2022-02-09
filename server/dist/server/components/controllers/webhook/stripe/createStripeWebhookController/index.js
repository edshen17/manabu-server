"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateStripeWebhookController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../../entities/utils/convertStringToObjectId");
const queryStringHandler_1 = require("../../../../usecases/utils/queryStringHandler");
const stripe_1 = require("../../../../usecases/webhook/stripe");
const createStripeWebhookController_1 = require("./createStripeWebhookController");
const makeCreateStripeWebhookController = new createStripeWebhookController_1.CreateStripeWebhookController({
    successStatusCode: http_status_codes_1.StatusCodes.CREATED,
    errorStatusCode: http_status_codes_1.StatusCodes.CONFLICT,
}).init({
    makeUsecase: stripe_1.makeCreateStripeWebhookUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeCreateStripeWebhookController = makeCreateStripeWebhookController;
