"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAppointmentEntity = void 0;
const entity_1 = require("../../validators/appointment/entity");
const appointmentEntity_1 = require("./appointmentEntity");
const makeAppointmentEntity = new appointmentEntity_1.AppointmentEntity().init({
    makeEntityValidator: entity_1.makeAppointmentEntityValidator,
});
exports.makeAppointmentEntity = makeAppointmentEntity;
