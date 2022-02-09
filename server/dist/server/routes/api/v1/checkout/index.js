"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = void 0;
const express_1 = __importDefault(require("express"));
const packageTransactions_1 = require("./packageTransactions");
const checkout = express_1.default.Router();
exports.checkout = checkout;
checkout.use('/packageTransactions', packageTransactions_1.packageTransactions);
