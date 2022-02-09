"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreatePaynowWebhookController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../../entities/utils/convertStringToObjectId");
const queryStringHandler_1 = require("../../../../usecases/utils/queryStringHandler");
const paynow_1 = require("../../../../usecases/webhook/paynow");
const createPaynowWebhookController_1 = require("./createPaynowWebhookController");
const makeCreatePaynowWebhookController = new createPaynowWebhookController_1.CreatePaynowWebhookController({
    successStatusCode: http_status_codes_1.StatusCodes.CREATED,
    errorStatusCode: http_status_codes_1.StatusCodes.CONFLICT,
}).init({
    makeUsecase: paynow_1.makeCreatePaynowWebhookUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeCreatePaynowWebhookController = makeCreatePaynowWebhookController;
