"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointments = void 0;
const express_1 = __importDefault(require("express"));
const createAppointmentsController_1 = require("../../../../components/controllers/appointment/createAppointmentsController");
const editAppointmentController_1 = require("../../../../components/controllers/appointment/editAppointmentController");
const getAppointmentController_1 = require("../../../../components/controllers/appointment/getAppointmentController");
const expressCallback_1 = require("../../../../components/webFrameworkCallbacks/callbacks/expressCallback");
const appointments = express_1.default.Router();
exports.appointments = appointments;
appointments.get('/:appointmentId', expressCallback_1.makeJSONExpressCallback.consume(getAppointmentController_1.makeGetAppointmentController));
appointments.post('/', expressCallback_1.makeJSONExpressCallback.consume(createAppointmentsController_1.makeCreateAppointmentsController));
appointments.patch('/:appointmentId', expressCallback_1.makeJSONExpressCallback.consume(editAppointmentController_1.makeEditAppointmentController));
