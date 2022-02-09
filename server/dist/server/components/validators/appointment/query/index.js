"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAppointmentQueryValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const appointmentQueryValidator_1 = require("./appointmentQueryValidator");
const makeAppointmentQueryValidator = new appointmentQueryValidator_1.AppointmentQueryValidator().init({ joi: joi_1.joi });
exports.makeAppointmentQueryValidator = makeAppointmentQueryValidator;
