"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paypal = void 0;
const express_1 = __importDefault(require("express"));
const createPaypalWebhookController_1 = require("../../../../../components/controllers/webhook/paypal/createPaypalWebhookController");
const expressCallback_1 = require("../../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const paypal = express_1.default.Router();
exports.paypal = paypal;
paypal.post('/', expressCallback_1.makeJSONExpressCallback.consume(createPaypalWebhookController_1.makeCreatePaypalWebhookController));
