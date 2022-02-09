"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const express_1 = __importDefault(require("express"));
const admin_1 = require("./admin");
const appointments_1 = require("./appointments");
const availableTimes_1 = require("./availableTimes");
const checkout_1 = require("./checkout");
const exchangeRates_1 = require("./exchangeRates");
const packages_1 = require("./packages");
const packageTransactions_1 = require("./packageTransactions");
const index_1 = require("./teachers/index");
const index_2 = require("./users/index");
const webhooks_1 = require("./webhooks");
const api = express_1.default.Router();
exports.api = api;
api.use('/appointments', appointments_1.appointments);
api.use('/availableTimes', availableTimes_1.availableTimes);
api.use('/packages', packages_1.packages);
api.use('/teachers', index_1.teachers);
api.use('/users', index_2.users);
api.use('/exchangeRates', exchangeRates_1.exchangeRates);
api.use('/packageTransactions', packageTransactions_1.packageTransactions);
api.use('/checkout', checkout_1.checkout);
api.use('/webhooks', webhooks_1.webhooks);
api.use('/admin', admin_1.admin);
