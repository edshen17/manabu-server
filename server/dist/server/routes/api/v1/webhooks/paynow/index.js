"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paynow = void 0;
const express_1 = __importDefault(require("express"));
const createPaynowWebhookController_1 = require("../../../../../components/controllers/webhook/paynow/createPaynowWebhookController");
const expressCallback_1 = require("../../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const paynow = express_1.default.Router();
exports.paynow = paynow;
paynow.post('/', expressCallback_1.makeJSONExpressCallback.consume(createPaynowWebhookController_1.makeCreatePaynowWebhookController));
