"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTransactionEntity = void 0;
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
class PackageTransactionEntity extends AbstractEntity_1.AbstractEntity {
    _dayjs;
    _buildTemplate = async (buildParams) => {
        const { hostedById, reservedById, packageId, lessonDuration, remainingAppointments, lessonLanguage, isSubscription, } = buildParams;
        const packageTransactionEntity = {
            hostedById,
            reservedById,
            packageId,
            transactionDate: new Date(),
            lessonDuration,
            terminationDate: this._dayjs().add(3, 'month').toDate(),
            isTerminated: false,
            remainingAppointments,
            lessonLanguage,
            isSubscription,
            status: 'confirmed',
            createdDate: new Date(),
            lastModifiedDate: new Date(),
        };
        return packageTransactionEntity;
    };
    _initTemplate = async (optionalInitParams) => {
        const { dayjs } = optionalInitParams;
        this._dayjs = dayjs;
    };
}
exports.PackageTransactionEntity = PackageTransactionEntity;
