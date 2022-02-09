"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAppointmentEntityValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const appointmentEntityValidator_1 = require("./appointmentEntityValidator");
const makeAppointmentEntityValidator = new appointmentEntityValidator_1.AppointmentEntityValidator().init({ joi: joi_1.joi });
exports.makeAppointmentEntityValidator = makeAppointmentEntityValidator;
