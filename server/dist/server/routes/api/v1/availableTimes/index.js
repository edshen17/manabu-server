"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.availableTimes = void 0;
const express_1 = __importDefault(require("express"));
const createAvailableTimeController_1 = require("../../../../components/controllers/availableTime/createAvailableTimeController");
const deleteAvailableTimeController_1 = require("../../../../components/controllers/availableTime/deleteAvailableTimeController");
const editAvailableTimeController_1 = require("../../../../components/controllers/availableTime/editAvailableTimeController");
const expressCallback_1 = require("../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const availableTimes = express_1.default.Router();
exports.availableTimes = availableTimes;
availableTimes.patch('/:availableTimeId', expressCallback_1.makeJSONExpressCallback.consume(editAvailableTimeController_1.makeEditAvailableTimeController));
availableTimes.delete('/:availableTimeId', expressCallback_1.makeJSONExpressCallback.consume(deleteAvailableTimeController_1.makeDeleteAvailableTimeController));
availableTimes.post('/', expressCallback_1.makeJSONExpressCallback.consume(createAvailableTimeController_1.makeCreateAvailableTimeController));
