"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.self = void 0;
const express_1 = __importDefault(require("express"));
const getAppointmentsController_1 = require("../../../../../components/controllers/appointment/getAppointmentsController");
const getAvailableTimesController_1 = require("../../../../../components/controllers/availableTime/getAvailableTimesController");
const getPackageTransactionsController_1 = require("../../../../../components/controllers/packageTransaction/getPackageTransactionsController");
const getUserTeacherEdgesController_1 = require("../../../../../components/controllers/user/getUserTeacherEdgesController");
const expressCallback_1 = require("../../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const self = express_1.default.Router();
exports.self = self;
self.get('/userTeacherEdges', expressCallback_1.makeJSONExpressCallback.consume(getUserTeacherEdgesController_1.makeGetUserTeacherEdgesController));
self.get('/appointments', expressCallback_1.makeJSONExpressCallback.consume(getAppointmentsController_1.makeGetAppointmentsController));
self.get('/availableTimes', expressCallback_1.makeJSONExpressCallback.consume(getAvailableTimesController_1.makeGetAvailableTimesController));
self.get('/packageTransactions', expressCallback_1.makeJSONExpressCallback.consume(getPackageTransactionsController_1.makeGetPackageTransactionsController));
