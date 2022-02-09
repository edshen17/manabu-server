"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageTransactionFactory_1 = require("../../testFixtures/fakeDbPackageTransactionFactory");
const fakeDbUserFactory_1 = require("../../testFixtures/fakeDbUserFactory");
const appointment_1 = require("../appointment");
let packageTransactionDbService;
let appointmentDbService;
let dbServiceAccessOptions;
let fakeDbPackageTransactionFactory;
let fakeDbUserFactory;
let fakeDbAppointmentFactory;
let fakePackageTransaction;
let fakeAppointment;
before(async () => {
    packageTransactionDbService = await _1.makePackageTransactionDbService;
    appointmentDbService = await appointment_1.makeAppointmentDbService;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    fakeDbAppointmentFactory = await fakeDbAppointmentFactory_1.makeFakeDbAppointmentFactory;
});
beforeEach(async () => {
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() + 30);
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
        hostedById: fakePackageTransaction.hostedById,
        reservedById: fakePackageTransaction.reservedById,
        packageTransactionId: fakePackageTransaction._id,
        startDate: new Date(),
        endDate,
    });
    dbServiceAccessOptions = packageTransactionDbService.getBaseDbServiceAccessOptions();
});
describe('packageTransactionDbService', () => {
    describe('findById, findOne, find', () => {
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if given an invalid id', async () => {
                    try {
                        await packageTransactionDbService.findById({
                            _id: undefined,
                            dbServiceAccessOptions,
                        });
                    }
                    catch (err) {
                        (0, chai_1.expect)(err).be.an('error');
                    }
                });
                it('should return null if given an non-existent id', async () => {
                    const findByIdPackageTransaction = await packageTransactionDbService.findById({
                        _id: '60979db0bb31ed001589a1ea',
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(findByIdPackageTransaction).to.equal(null);
                });
            });
            context('valid inputs', () => {
                const getPackageTransaction = async () => {
                    const findParams = {
                        searchQuery: {
                            hostedById: fakePackageTransaction.hostedById,
                        },
                        dbServiceAccessOptions,
                    };
                    const findByIdPackageTransaction = await packageTransactionDbService.findById({
                        _id: fakePackageTransaction._id,
                        dbServiceAccessOptions,
                    });
                    const findOnePackageTransaction = await packageTransactionDbService.findOne(findParams);
                    const findPackageTransactions = await packageTransactionDbService.find(findParams);
                    (0, chai_1.expect)(findByIdPackageTransaction).to.deep.equal(findOnePackageTransaction);
                    (0, chai_1.expect)(findByIdPackageTransaction).to.deep.equal(findPackageTransactions[0]);
                    (0, chai_1.expect)(findByIdPackageTransaction.hostedByData).to.not.have.property('password');
                    (0, chai_1.expect)(findByIdPackageTransaction.hostedByData).to.not.have.property('email');
                    (0, chai_1.expect)(findByIdPackageTransaction.hostedByData).to.not.have.property('settings');
                    (0, chai_1.expect)(findByIdPackageTransaction.hostedByData).to.not.have.property('commMethods');
                    (0, chai_1.expect)(findByIdPackageTransaction.reservedByData).to.not.have.property('password');
                    (0, chai_1.expect)(findByIdPackageTransaction.reservedByData).to.not.have.property('email');
                    (0, chai_1.expect)(findByIdPackageTransaction.reservedByData).to.not.have.property('settings');
                    (0, chai_1.expect)(findByIdPackageTransaction.reservedByData).to.not.have.property('commMethods');
                };
                context('as a non-admin user', () => {
                    context('viewing self', () => {
                        it('should find the packageTransaction and return an restricted view on some data', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await getPackageTransaction();
                        });
                    });
                    context('viewing other', () => {
                        it('should find the packageTransaction and return an restricted view on some data', async () => {
                            await getPackageTransaction();
                        });
                    });
                });
                context('as an admin', () => {
                    it('should find the packageTransaction and return an restricted view on some data', async () => {
                        await getPackageTransaction();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    const findByIdPackageTransaction = await packageTransactionDbService.findById({
                        _id: fakePackageTransaction._id,
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
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if required fields are not given', async () => {
                    try {
                        fakePackageTransaction = await packageTransactionDbService.insert({
                            modelToInsert: {},
                            dbServiceAccessOptions,
                        });
                    }
                    catch (err) {
                        (0, chai_1.expect)(err).to.be.an('error');
                    }
                });
            });
            context('valid inputs', () => {
                it('should insert a packageTransaction', async () => {
                    const findByIdPackageTransaction = await packageTransactionDbService.findById({
                        _id: fakePackageTransaction._id,
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(findByIdPackageTransaction).to.not.equal(null);
                    (0, chai_1.expect)(findByIdPackageTransaction).to.deep.equal(fakePackageTransaction);
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                const { _id, ...modelToInsert } = fakePackageTransaction;
                try {
                    fakePackageTransaction = await packageTransactionDbService.insert({
                        modelToInsert,
                        dbServiceAccessOptions,
                    });
                }
                catch (err) {
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
    describe('update', () => {
        const updatePackageTransaction = async () => {
            const overrideDbServiceAccessOptions = appointmentDbService.getOverrideDbServiceAccessOptions();
            const updatedPackageTransaction = await packageTransactionDbService.findOneAndUpdate({
                searchQuery: { _id: fakePackageTransaction._id },
                updateQuery: { lessonLanguage: 'en' },
                dbServiceAccessOptions,
            });
            const updatedAppointment = await appointmentDbService.findOne({
                searchQuery: { packageTransactionId: updatedPackageTransaction._id },
                dbServiceAccessOptions: overrideDbServiceAccessOptions,
            });
            (0, chai_1.expect)(updatedPackageTransaction).to.not.deep.equal(fakePackageTransaction);
            (0, chai_1.expect)(updatedPackageTransaction.lessonLanguage).to.equal('en');
            (0, chai_1.expect)(updatedAppointment.packageTransactionData.lessonLanguage).to.equal('en');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should return null if the packageTransaction to update does not exist', async () => {
                    const updatedPackageTransaction = await packageTransactionDbService.findOneAndUpdate({
                        searchQuery: {
                            _id: fakePackageTransaction.hostedById,
                        },
                        updateQuery: { lessonLanguage: 'en' },
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(updatedPackageTransaction).to.equal(null);
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('updating self', () => {
                        it('should update the packageTransaction', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await updatePackageTransaction();
                        });
                    });
                    context('updating other', async () => {
                        it('should update the packageTransaction', async () => {
                            await updatePackageTransaction();
                        });
                    });
                });
                context('as an admin', async () => {
                    it('should update the packageTransaction', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await updatePackageTransaction();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    await updatePackageTransaction();
                }
                catch (err) {
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
    describe('delete', () => {
        const deletePackageTransaction = async () => {
            const deletedPackage = await packageTransactionDbService.findByIdAndDelete({
                _id: fakePackageTransaction._id,
                dbServiceAccessOptions,
            });
            const foundPackage = await packageTransactionDbService.findById({
                _id: fakePackageTransaction._id,
                dbServiceAccessOptions,
            });
            (0, chai_1.expect)(foundPackage).to.not.deep.equal(deletedPackage);
            (0, chai_1.expect)(foundPackage).to.be.equal(null);
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should return null if the packageTransaction to delete does not exist', async () => {
                    const deletedPackage = await packageTransactionDbService.findByIdAndDelete({
                        _id: fakePackageTransaction.hostedById,
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(deletedPackage).to.equal(null);
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('deleting self', () => {
                        it('should update the packageTransaction', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await deletePackageTransaction();
                        });
                    });
                    context('deleting other', async () => {
                        it('should update the packageTransaction', async () => {
                            await deletePackageTransaction();
                        });
                    });
                });
                context('as an admin', async () => {
                    it('should update the packageTransaction', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await deletePackageTransaction();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    await deletePackageTransaction();
                }
                catch (err) {
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
});
