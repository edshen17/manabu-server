"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeDbAvailableTimeFactory = void 0;
const AbstractFakeDbDataFactory_1 = require("../abstractions/AbstractFakeDbDataFactory");
class FakeDbAvailableTimeFactory extends AbstractFakeDbDataFactory_1.AbstractFakeDbDataFactory {
    _fakeDbUserFactory;
    _dayjs;
    _createFakeBuildParams = async () => {
        const fakeTeacher = await this._fakeDbUserFactory.createFakeDbTeacher();
        const fakeBuildParams = {
            hostedById: fakeTeacher._id,
            startDate: this._dayjs().toDate(),
            endDate: this._dayjs().add(1, 'hour').toDate(),
        };
        return fakeBuildParams;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeFakeDbUserFactory, dayjs } = optionalInitParams;
        this._fakeDbUserFactory = await makeFakeDbUserFactory;
        this._dayjs = dayjs;
    };
}
exports.FakeDbAvailableTimeFactory = FakeDbAvailableTimeFactory;
