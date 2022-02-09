"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const express_1 = __importDefault(require("express"));
const createStripeWebhookController_1 = require("../../../../../components/controllers/webhook/stripe/createStripeWebhookController");
const expressCallback_1 = require("../../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const stripe = express_1.default.Router();
exports.stripe = stripe;
stripe.post('/', expressCallback_1.makeJSONExpressCallback.consume(createStripeWebhookController_1.makeCreateStripeWebhookController));
