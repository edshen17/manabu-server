"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeDbAppointmentFactory = void 0;
const AbstractFakeDbDataFactory_1 = require("../abstractions/AbstractFakeDbDataFactory");
class FakeDbAppointmentFactory extends AbstractFakeDbDataFactory_1.AbstractFakeDbDataFactory {
    _fakeDbPackageTransactionFactory;
    _dayjs;
    _createFakeBuildParams = async () => {
        const fakePackageTransaction = await this._fakeDbPackageTransactionFactory.createFakeDbData();
        const fakeBuildParams = {
            hostedById: fakePackageTransaction.hostedById,
            reservedById: fakePackageTransaction.reservedById,
            packageTransactionId: fakePackageTransaction._id,
            startDate: this._dayjs().toDate(),
            endDate: this._dayjs().add(1, 'hour').toDate(),
        };
        return fakeBuildParams;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeFakeDbPackageTransactionFactory, dayjs } = optionalInitParams;
        this._fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
        this._dayjs = dayjs;
    };
}
exports.FakeDbAppointmentFactory = FakeDbAppointmentFactory;
