"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAppointmentParamsValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const appointmentParamsValidator_1 = require("./appointmentParamsValidator");
const makeAppointmentParamsValidator = new appointmentParamsValidator_1.AppointmentParamsValidator().init({ joi: joi_1.joi });
exports.makeAppointmentParamsValidator = makeAppointmentParamsValidator;
