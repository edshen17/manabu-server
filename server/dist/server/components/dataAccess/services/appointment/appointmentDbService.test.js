"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageTransactionFactory_1 = require("../../testFixtures/fakeDbPackageTransactionFactory");
let appointmentDbService;
let fakeDbAppointmentFactory;
let fakeDbPackageTransactionFactory;
let dbServiceAccessOptions;
let fakePackageTransaction;
let fakeAppointment;
before(async () => {
    appointmentDbService = await _1.makeAppointmentDbService;
    fakeDbAppointmentFactory = await fakeDbAppointmentFactory_1.makeFakeDbAppointmentFactory;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
});
beforeEach(async () => {
    dbServiceAccessOptions = appointmentDbService.getBaseDbServiceAccessOptions();
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
    fakeAppointment = await fakeDbAppointmentFactory.createFakeDbData({
        hostedById: fakePackageTransaction.hostedById,
        reservedById: fakePackageTransaction.reservedById,
        packageTransactionId: fakePackageTransaction._id,
        startDate: (0, dayjs_1.default)().toDate(),
        endDate: (0, dayjs_1.default)().add(30, 'minute').toDate(),
    });
});
describe('appointmentDbService', () => {
    describe('findById, findOne, find', () => {
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should return null if given an invalid id', async () => {
                    const notFound = await appointmentDbService.findById({
                        _id: undefined,
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(notFound).be.equal(null);
                });
                it('should return null if given an non-existent id', async () => {
                    const findByIdAppointment = await appointmentDbService.findById({
                        _id: '60979db0bb31ed001589a1ea',
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(findByIdAppointment).to.equal(null);
                });
            });
            context('valid inputs', () => {
                const getAppointment = async (dbServiceAccessOptions) => {
                    const findParams = {
                        searchQuery: {
                            hostedById: fakeAppointment.hostedById,
                        },
                        dbServiceAccessOptions,
                    };
                    const findByIdAppointment = await appointmentDbService.findById({
                        _id: fakeAppointment._id,
                        dbServiceAccessOptions,
                    });
                    const findOneAppointment = await appointmentDbService.findOne(findParams);
                    const findAppointments = await appointmentDbService.find(findParams);
                    (0, chai_1.expect)(findByIdAppointment).to.deep.equal(findOneAppointment);
                    (0, chai_1.expect)(findByIdAppointment).to.deep.equal(findAppointments[0]);
                    if (dbServiceAccessOptions.isSelf ||
                        dbServiceAccessOptions.isOverrideView ||
                        dbServiceAccessOptions.currentAPIUserRole == 'admin') {
                        const appointmentPackageTransactionData = findByIdAppointment.packageTransactionData;
                        (0, chai_1.expect)(findByIdAppointment).to.deep.equal(findOneAppointment);
                        (0, chai_1.expect)(findByIdAppointment).to.deep.equal(findAppointments[0]);
                        (0, chai_1.expect)(appointmentPackageTransactionData.hostedByData).to.not.have.property('password');
                        (0, chai_1.expect)(appointmentPackageTransactionData.hostedByData).to.not.have.property('email');
                        (0, chai_1.expect)(appointmentPackageTransactionData.hostedByData).to.not.have.property('settings');
                        (0, chai_1.expect)(appointmentPackageTransactionData.hostedByData).to.not.have.property('commMethods');
                    }
                    else {
                        (0, chai_1.expect)(findByIdAppointment).to.not.have.property('reservedById');
                        (0, chai_1.expect)(findByIdAppointment).to.not.have.property('packageTransactionId');
                        (0, chai_1.expect)(findByIdAppointment).to.not.have.property('packageTransactionData');
                    }
                };
                context('as a non-admin user', () => {
                    context('viewing self', () => {
                        it('should find the appointment and return an unrestricted view on some data', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await getAppointment(dbServiceAccessOptions);
                        });
                    });
                    context('viewing other', () => {
                        it('should find the appointment and return a restricted view on some data', async () => {
                            await getAppointment(dbServiceAccessOptions);
                        });
                    });
                });
                context('as an admin', () => {
                    it('should find the appointment and return an restricted view on some data', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await getAppointment(dbServiceAccessOptions);
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                let error;
                try {
                    await appointmentDbService.findById({
                        _id: fakeAppointment._id,
                        dbServiceAccessOptions,
                    });
                }
                catch (err) {
                    error = err;
                }
                (0, chai_1.expect)(error).be.an('error');
            });
        });
    });
    describe('insert', () => {
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if required fields are not given', async () => {
                    let error;
                    try {
                        await appointmentDbService.insert({
                            modelToInsert: {},
                            dbServiceAccessOptions,
                        });
                    }
                    catch (err) {
                        error = err;
                    }
                    (0, chai_1.expect)(error).be.an('error');
                });
            });
            context('valid inputs', () => {
                it('should insert an appointment', async () => {
                    const findByIdAppointment = await appointmentDbService.findById({
                        _id: fakeAppointment._id,
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(findByIdAppointment).to.not.equal(null);
                    (0, chai_1.expect)(findByIdAppointment).to.deep.equal(fakeAppointment);
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                const { _id, ...modelToInsert } = fakeAppointment;
                let error;
                try {
                    await appointmentDbService.insert({
                        modelToInsert,
                        dbServiceAccessOptions,
                    });
                }
                catch (err) {
                    error = err;
                }
                (0, chai_1.expect)(error).be.an('error');
            });
        });
    });
    describe('update', () => {
        const updateAppointment = async () => {
            const updatedAppointment = await appointmentDbService.findOneAndUpdate({
                searchQuery: { _id: fakeAppointment._id },
                updateQuery: { status: 'cancelled' },
                dbServiceAccessOptions,
            });
            (0, chai_1.expect)(updatedAppointment).to.not.deep.equal(fakeAppointment);
            (0, chai_1.expect)(updatedAppointment.status).to.equal('cancelled');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should return null if the appointment to update does not exist', async () => {
                    const updatedAppointment = await appointmentDbService.findOneAndUpdate({
                        searchQuery: {
                            _id: fakeAppointment.hostedById,
                        },
                        updateQuery: { status: 'cancelled' },
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(updatedAppointment).to.equal(null);
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('updating self', () => {
                        it('should update the appointment', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await updateAppointment();
                        });
                    });
                    context('updating other', async () => {
                        it('should update the appointment', async () => {
                            await updateAppointment();
                        });
                    });
                });
                context('as an admin', async () => {
                    it('should update the appointment', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await updateAppointment();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                let error;
                try {
                    await updateAppointment();
                }
                catch (err) {
                    error = err;
                }
                (0, chai_1.expect)(error).be.an('error');
            });
        });
    });
    describe('delete', () => {
        const deleteAppointment = async () => {
            const deletedAppointment = await appointmentDbService.findByIdAndDelete({
                _id: fakeAppointment._id,
                dbServiceAccessOptions,
            });
            const foundAppointment = await appointmentDbService.findById({
                _id: fakeAppointment._id,
                dbServiceAccessOptions,
            });
            (0, chai_1.expect)(foundAppointment).to.not.deep.equal(deletedAppointment);
            (0, chai_1.expect)(foundAppointment).to.be.equal(null);
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should return null if the minuteBank to delete does not exist', async () => {
                    const deletedAppointment = await appointmentDbService.findByIdAndDelete({
                        _id: fakeAppointment.hostedById,
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(deletedAppointment).to.equal(null);
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('deleting self', () => {
                        it('should update the minuteBank', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await deleteAppointment();
                        });
                    });
                    context('deleting other', async () => {
                        it('should update the minuteBank', async () => {
                            await deleteAppointment();
                        });
                    });
                });
                context('as an admin', async () => {
                    it('should update the minuteBank', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await deleteAppointment();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                let error;
                try {
                    await deleteAppointment();
                }
                catch (err) {
                    error = err;
                }
                (0, chai_1.expect)(error).to.be.an('error');
            });
        });
    });
});
