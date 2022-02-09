"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageTransactions = void 0;
const express_1 = __importDefault(require("express"));
const createPackageTransactionCheckoutController_1 = require("../../../../../components/controllers/checkout/packageTransaction/createPackageTransactionCheckoutController");
const expressCallback_1 = require("../../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const packageTransactions = express_1.default.Router();
exports.packageTransactions = packageTransactions;
packageTransactions.post('/', expressCallback_1.makeJSONExpressCallback.consume(createPackageTransactionCheckoutController_1.makeCreatePackageTransactionCheckoutController));
