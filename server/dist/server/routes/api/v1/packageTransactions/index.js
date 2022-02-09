"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageTransactions = void 0;
const express_1 = __importDefault(require("express"));
const getPackageTransactionController_1 = require("../../../../components/controllers/packageTransaction/getPackageTransactionController");
const expressCallback_1 = require("../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const packageTransactions = express_1.default.Router();
exports.packageTransactions = packageTransactions;
packageTransactions.get('/:packageTransactionId', expressCallback_1.makeJSONExpressCallback.consume(getPackageTransactionController_1.makeGetPackageTransactionController));
