"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeDbTeacherFactory = void 0;
const AbstractFakeDbEmbeddedDataFactory_1 = require("../abstractions/AbstractFakeDbEmbeddedDataFactory");
class FakeDbTeacherFactory extends AbstractFakeDbEmbeddedDataFactory_1.AbstractFakeDbEmbeddedDataFactory {
    createFakeData = async () => {
        const fakeBuildParams = await this._createFakeBuildParams();
        const fakeData = await this._entity.build(fakeBuildParams);
        fakeData.applicationStatus = 'approved';
        fakeData.teachingLanguages.push({ code: 'ja', level: 'C2' });
        fakeData.alsoSpeaks.push({ code: 'en', level: 'C2' });
        fakeData.settings.payoutData.email = 'payout-sdk-2@paypal.com';
        return fakeData;
    };
    _createFakeBuildParams = async () => {
        const fakeBuildParams = {};
        return fakeBuildParams;
    };
}
exports.FakeDbTeacherFactory = FakeDbTeacherFactory;
