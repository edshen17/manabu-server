"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeDbPackageTransactionFactory = void 0;
const AbstractFakeDbDataFactory_1 = require("../abstractions/AbstractFakeDbDataFactory");
class FakeDbPackageTransactionFactory extends AbstractFakeDbDataFactory_1.AbstractFakeDbDataFactory {
    _fakeDbUserFactory;
    _createFakeBuildParams = async () => {
        const fakeTeacher = await this._fakeDbUserFactory.createFakeDbTeacher();
        const fakeUser = await this._fakeDbUserFactory.createFakeDbUser();
        const fakeBuildParams = {
            hostedById: fakeTeacher._id,
            reservedById: fakeUser._id,
            packageId: fakeTeacher.teacherData.packages[0]._id,
            lessonDuration: 60,
            remainingAppointments: 12,
            lessonLanguage: 'ja',
            isSubscription: false,
        };
        return fakeBuildParams;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeFakeDbUserFactory } = optionalInitParams;
        this._fakeDbUserFactory = await makeFakeDbUserFactory;
    };
}
exports.FakeDbPackageTransactionFactory = FakeDbPackageTransactionFactory;
