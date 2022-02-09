"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbUserFactory_1 = require("../fakeDbUserFactory");
let fakeDbPackageTransactionFactory;
let fakeDbUserFactory;
before(async () => {
    fakeDbPackageTransactionFactory = await _1.makeFakeDbPackageTransactionFactory;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
});
describe('fakeDbPackageTransaction', () => {
    describe('createFakeDbData', () => {
        it('should create a fake package transaction using data from a fake teacher', async () => {
            const fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
            (0, chai_1.expect)(fakePackageTransaction._id.toString().length).to.equal(24);
        });
        it('should create a fake package transaction using data from the given fake users', async () => {
            const fakeUser = await fakeDbUserFactory.createFakeDbUser();
            const fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
            const fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData({
                hostedById: fakeTeacher._id,
                reservedById: fakeUser._id,
                packageId: fakeTeacher.teacherData.packages[0]._id,
                lessonDuration: 60,
                remainingAppointments: 0,
                lessonLanguage: 'ja',
                isSubscription: false,
            });
            (0, chai_1.expect)(fakePackageTransaction._id.toString().length).to.equal(24);
        });
    });
});
