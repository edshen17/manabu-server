"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhooks = void 0;
const express_1 = __importDefault(require("express"));
const paynow_1 = require("./paynow");
const paypal_1 = require("./paypal");
const stripe_1 = require("./stripe");
const webhooks = express_1.default.Router();
exports.webhooks = webhooks;
webhooks.use('/stripe', stripe_1.stripe);
webhooks.use('/paypal', paypal_1.paypal);
webhooks.use('/paynow', paynow_1.paynow);
