"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreatePaypalWebhookController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../../entities/utils/convertStringToObjectId");
const queryStringHandler_1 = require("../../../../usecases/utils/queryStringHandler");
const paypal_1 = require("../../../../usecases/webhook/paypal");
const createPaypalWebhookController_1 = require("./createPaypalWebhookController");
const makeCreatePaypalWebhookController = new createPaypalWebhookController_1.CreatePaypalWebhookController({
    successStatusCode: http_status_codes_1.StatusCodes.CREATED,
    errorStatusCode: http_status_codes_1.StatusCodes.CONFLICT,
}).init({
    makeUsecase: paypal_1.makeCreatePaypalWebhookUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeCreatePaypalWebhookController = makeCreatePaypalWebhookController;
