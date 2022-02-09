"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageFactory_1 = require("../../testFixtures/fakeDbPackageFactory");
const fakeDbPackageTransactionFactory_1 = require("../../testFixtures/fakeDbPackageTransactionFactory");
const fakeDbUserFactory_1 = require("../../testFixtures/fakeDbUserFactory");
const appointment_1 = require("../appointment");
const packageTransaction_1 = require("../packageTransaction");
let packageDbService;
let packageTransactionDbService;
let appointmentDbService;
let fakeDbPackageFactory;
let fakeDbUserFactory;
let fakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory;
let fakeUser;
let fakeTeacher;
let fakePackage;
let fakePackageTransaction;
let fakeAppointment;
let dbServiceAccessOptions;
before(async () => {
    packageDbService = await _1.makePackageDbService;
    packageTransactionDbService = await packageTransaction_1.makePackageTransactionDbService;
    appointmentDbService = await appointment_1.makeAppointmentDbService;
    fakeDbPackageFactory = await fakeDbPackageFactory_1.makeFakeDbPackageFactory;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    fakeDbAppointmentFactory = await fakeDbAppointmentFactory_1.makeFakeDbAppointmentFactory;
});
beforeEach(async () => {
    dbServiceAccessOptions = packageDbService.getBaseDbServiceAccessOptions();
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    fakePackage = fakeTeacher.teacherData.packages[0];
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData({
        hostedById: fakeTeacher._id,
        reservedById: fakeUser._id,
        packageId: fakePackage._id,
        lessonDuration: 60,
        remainingAppointments: 0,
        lessonLanguage: 'ja',
        isSubscription: false,
    });
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() + 30);
    fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
        hostedById: fakePackageTransaction.hostedById,
        reservedById: fakePackageTransaction.reservedById,
        packageTransactionId: fakePackageTransaction._id,
        startDate: new Date(),
        endDate,
    });
});
describe('packageDbService', () => {
    describe('findById, findOne, find', () => {
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if given an invalid id', async () => {
                    try {
                        await packageDbService.findById({
                            _id: undefined,
                            dbServiceAccessOptions,
                        });
                    }
                    catch (err) {
                        (0, chai_1.expect)(err).be.an('error');
                    }
                });
                it('should return null if given an non-existent id', async () => {
                    const findByIdPackage = await packageDbService.findById({
                        _id: '60979db0bb31ed001589a1ea',
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(findByIdPackage).to.equal(null);
                });
            });
            context('valid inputs', () => {
                const getPackage = async () => {
                    const findParams = {
                        searchQuery: {
                            _id: fakePackage._id,
                        },
                        dbServiceAccessOptions,
                    };
                    const findByIdPackage = await packageDbService.findById({
                        _id: fakePackage._id,
                        dbServiceAccessOptions,
                    });
                    const findByIdPackageCache = await packageDbService.findById({
                        _id: fakePackage._id,
                        dbServiceAccessOptions,
                    });
                    const findOnePackage = await packageDbService.findOne({
                        searchQuery: {
                            _id: fakePackage._id,
                        },
                        dbServiceAccessOptions,
                    });
                    const findPackages = await packageDbService.find(findParams);
                    (0, chai_1.expect)(findByIdPackage.lessonDurations).to.deep.equal(findByIdPackageCache.lessonDurations);
                    (0, chai_1.expect)(findByIdPackage).to.deep.equal(findOnePackage);
                    (0, chai_1.expect)(findByIdPackage).to.deep.equal(findPackages[0]);
                };
                context('as a non-admin user', () => {
                    context('viewing self', () => {
                        it('should find the package and return an unrestricted view', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await getPackage();
                        });
                    });
                    context('viewing other', () => {
                        it('should find the package and return an unrestricted view', async () => {
                            await getPackage();
                        });
                    });
                });
                context('as an admin', () => {
                    it('should find the package and return an unrestricted view', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await getPackage();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    const findByIdPackage = await packageDbService.findById({
                        _id: fakeTeacher._id,
                        dbServiceAccessOptions,
                    });
                }
                catch (err) {
                    (0, chai_1.expect)(err).to.be.an('error');
                }
            });
        });
    });
    describe('insert', () => {
        it('should throw an error', async () => {
            const { _id, ...modelToInsert } = fakePackage;
            try {
                fakePackage = await packageDbService.insert({
                    modelToInsert,
                    dbServiceAccessOptions,
                });
            }
            catch (err) {
                (0, chai_1.expect)(err).to.be.an('error');
            }
        });
    });
    describe('update', () => {
        const updatePackage = async () => {
            const overrideDbServiceAccessOptions = appointmentDbService.getOverrideDbServiceAccessOptions();
            const updatedPackage = (await packageDbService.findOneAndUpdate({
                searchQuery: { _id: fakePackage._id },
                updateQuery: { type: 'custom' },
                dbServiceAccessOptions,
            }));
            const updatedPackageTransaction = await packageTransactionDbService.findOne({
                searchQuery: { packageId: fakePackage._id },
                dbServiceAccessOptions,
            });
            const updatedAppointment = await appointmentDbService.findOne({
                searchQuery: {
                    packageTransactionId: updatedPackageTransaction._id,
                },
                dbServiceAccessOptions: overrideDbServiceAccessOptions,
            });
            (0, chai_1.expect)(updatedPackage).to.not.deep.equal(fakePackage);
            (0, chai_1.expect)(updatedPackage.type).to.equal('custom');
            (0, chai_1.expect)(updatedPackageTransaction.packageData.type).to.equal('custom');
            (0, chai_1.expect)(updatedAppointment.packageTransactionData.packageData.type).to.equal('custom');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should return the original package if update field does not exist', async () => {
                    const updatedPackage = await packageDbService.findOneAndUpdate({
                        searchQuery: { _id: fakePackage._id },
                        updateQuery: {
                            nonExistentField: 'some non-existent field',
                        },
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(updatedPackage).to.deep.equal(fakePackage);
                });
                it('should return null if the package to update does not exist', async () => {
                    const updatedPackage = await packageDbService.findOneAndUpdate({
                        searchQuery: {
                            _id: '608c09b0f12568001535df9a',
                        },
                        updateQuery: { type: 'custom' },
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(updatedPackage).to.equal(null);
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('updating self', () => {
                        it('should update the package', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await updatePackage();
                        });
                    });
                    context('updating other', async () => {
                        it('should update the package', async () => {
                            await updatePackage();
                        });
                    });
                });
                context('as an admin', async () => {
                    it('should update the package', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await updatePackage();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    await updatePackage();
                }
                catch (err) {
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
    describe('delete', () => {
        const deletePackage = async () => {
            const deletedPackage = await packageDbService.findByIdAndDelete({
                _id: fakePackage._id,
                dbServiceAccessOptions,
            });
            const foundPackage = await packageDbService.findById({
                _id: fakePackage._id,
                dbServiceAccessOptions,
            });
            (0, chai_1.expect)(foundPackage).to.not.deep.equal(deletedPackage);
            (0, chai_1.expect)(foundPackage).to.be.equal(null);
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should return null if the package to delete does not exist', async () => {
                    const deletedPackage = await packageDbService.findByIdAndDelete({
                        _id: undefined,
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(deletedPackage).to.equal(null);
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('deleting self', () => {
                        it('should update the package', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await deletePackage();
                        });
                    });
                    context('deleting other', async () => {
                        it('should update the package', async () => {
                            await deletePackage();
                        });
                    });
                });
                context('as an admin', async () => {
                    it('should update the package', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await deletePackage();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    await deletePackage();
                }
                catch (err) {
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
});
