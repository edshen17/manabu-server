"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fakeDbUserFactory_1 = require("../../dataAccess/testFixtures/fakeDbUserFactory");
const index_1 = require("./index");
let fakeDbUserFactory;
let packageTransactionEntity;
before(async () => {
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    packageTransactionEntity = await index_1.makePackageTransactionEntity;
});
context('packageTransaction entity', () => {
    describe('build', async () => {
        context('given valid inputs', () => {
            it("should return a package transaction with the teacher's data", async () => {
                const fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
                const fakePackageTransaction = await packageTransactionEntity.build({
                    hostedById: fakeTeacher._id,
                    reservedById: fakeTeacher._id,
                    packageId: fakeTeacher.teacherData.packages[0]._id,
                    lessonDuration: 60,
                    remainingAppointments: 5,
                    lessonLanguage: 'ja',
                    isSubscription: false,
                });
                (0, chai_1.expect)(fakePackageTransaction.lessonLanguage).to.equal('ja');
                (0, chai_1.expect)(fakePackageTransaction.isSubscription).to.equal(false);
            });
        });
        context('given invalid inputs', () => {
            it('should throw an error', async () => {
                try {
                    const entityData = {
                        hostedById: 'bad id',
                    };
                    const fakePackageTransaction = await packageTransactionEntity.build(entityData);
                }
                catch (err) {
                    (0, chai_1.expect)(err).to.be.an('error');
                }
            });
        });
    });
});
