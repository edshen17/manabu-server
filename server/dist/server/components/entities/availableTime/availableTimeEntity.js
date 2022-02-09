"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableTimeEntity = void 0;
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
class AvailableTimeEntity extends AbstractEntity_1.AbstractEntity {
    _buildTemplate = async (buildParams) => {
        const { hostedById, startDate, endDate } = buildParams;
        const availableTimeEntity = {
            hostedById,
            startDate,
            endDate,
            createdDate: new Date(),
            lastModifiedDate: new Date(),
        };
        return availableTimeEntity;
    };
}
exports.AvailableTimeEntity = AvailableTimeEntity;
