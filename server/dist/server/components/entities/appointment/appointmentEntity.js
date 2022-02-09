"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentEntity = void 0;
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
class AppointmentEntity extends AbstractEntity_1.AbstractEntity {
    _buildTemplate = async (buildParams) => {
        const { hostedById, reservedById, packageTransactionId, startDate, endDate } = buildParams;
        const appointmentEntity = {
            hostedById,
            reservedById,
            packageTransactionId,
            startDate,
            endDate,
            status: 'pending',
            createdDate: new Date(),
            lastModifiedDate: new Date(),
        };
        return appointmentEntity;
    };
}
exports.AppointmentEntity = AppointmentEntity;
