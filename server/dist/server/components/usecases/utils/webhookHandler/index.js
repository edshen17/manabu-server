"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeWebhookHandler = void 0;
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const createPackageTransactionUsecase_1 = require("../../packageTransaction/createPackageTransactionUsecase");
const controllerDataBuilder_1 = require("../controllerDataBuilder");
const webhookHandler_1 = require("./webhookHandler");
const makeWebhookHandler = new webhookHandler_1.WebhookHandler().init({
    makeControllerDataBuilder: controllerDataBuilder_1.makeControllerDataBuilder,
    makeCreatePackageTransactionUsecase: createPackageTransactionUsecase_1.makeCreatePackageTransactionUsecase,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeWebhookHandler = makeWebhookHandler;
