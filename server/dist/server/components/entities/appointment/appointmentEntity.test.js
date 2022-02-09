"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbPackageTransactionFactory_1 = require("../../dataAccess/testFixtures/fakeDbPackageTransactionFactory");
const fakeDbUserFactory_1 = require("../../dataAccess/testFixtures/fakeDbUserFactory");
let appointmentEntity;
let fakeDbUserFactory;
let fakeDbPackageTransactionFactory;
before(async () => {
    appointmentEntity = await _1.makeAppointmentEntity;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
});
describe('appointmentEntity', () => {
    describe('build', () => {
        context('valid inputs', () => {
            it('should build an appointment that has the given inputs as well as additional information from the db', async () => {
                const fakeHostedBy = await fakeDbUserFactory.createFakeDbTeacher();
                const fakeReservedBy = await fakeDbUserFactory.createFakeDbUser();
                const fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData({
                    hostedById: fakeHostedBy._id,
                    reservedById: fakeReservedBy._id,
                    packageId: fakeHostedBy.teacherData.packages[0]._id,
                    lessonDuration: 60,
                    remainingAppointments: 0,
                    lessonLanguage: 'ja',
                    isSubscription: false,
                });
                const endDate = new Date();
                endDate.setMinutes(endDate.getMinutes() + 30);
                const fakeAppointment = await appointmentEntity.build({
                    hostedById: fakeHostedBy._id,
                    reservedById: fakeReservedBy._id,
                    packageTransactionId: fakePackageTransaction._id,
                    startDate: new Date(),
                    endDate,
                });
                (0, chai_1.expect)(fakeAppointment.hostedById).to.equal(fakeHostedBy._id);
                (0, chai_1.expect)(fakeAppointment.reservedById).to.equal(fakeReservedBy._id);
            });
        });
        context('invalid inputs', () => {
            it('should throw an error', async () => {
                try {
                    const entityData = {};
                    const fakeAppointment = await appointmentEntity.build(entityData);
                }
                catch (err) {
                    (0, chai_1.expect)(err).to.be.an('error');
                }
            });
        });
    });
});
