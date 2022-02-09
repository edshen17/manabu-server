"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageTransactionFactory_1 = require("../../testFixtures/fakeDbPackageTransactionFactory");
const fakeDbUserFactory_1 = require("../../testFixtures/fakeDbUserFactory");
const appointment_1 = require("../appointment");
const packageTransaction_1 = require("../packageTransaction");
const user_1 = require("../user");
let userDbService;
let teacherDbService;
let packageTransactionDbService;
let appointmentDbService;
let dbServiceAccessOptions;
let fakeDbUserFactory;
let fakeDbPackageTransactionFactory;
let fakeDbAppointmentFactory;
let fakeUser;
let fakeTeacher;
let fakePackageTransaction;
let fakeAppointment;
before(async () => {
    userDbService = await user_1.makeUserDbService;
    teacherDbService = await _1.makeTeacherDbService;
    packageTransactionDbService = await packageTransaction_1.makePackageTransactionDbService;
    appointmentDbService = await appointment_1.makeAppointmentDbService;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
    fakeDbPackageTransactionFactory = await fakeDbPackageTransactionFactory_1.makeFakeDbPackageTransactionFactory;
    fakeDbAppointmentFactory = await fakeDbAppointmentFactory_1.makeFakeDbAppointmentFactory;
});
beforeEach(async () => {
    dbServiceAccessOptions = userDbService.getBaseDbServiceAccessOptions();
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData({
        hostedById: fakeTeacher._id,
        reservedById: fakeUser._id,
        packageId: fakeTeacher.teacherData.packages[0]._id,
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
describe('teacherDbService', () => {
    describe('findById, findOne, find', () => {
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if given an invalid id', async () => {
                    try {
                        await teacherDbService.findById({
                            _id: undefined,
                            dbServiceAccessOptions,
                        });
                    }
                    catch (err) {
                        (0, chai_1.expect)(err).be.an('error');
                    }
                });
                it('should return null if given an non-existent id', async () => {
                    const findByIdTeacher = await teacherDbService.findById({
                        _id: '60979db0bb31ed001589a1ea',
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(findByIdTeacher).to.equal(null);
                });
            });
            context('valid inputs', () => {
                const getTeacher = async () => {
                    const findParams = {
                        searchQuery: {
                            _id: fakeTeacher.teacherData._id,
                        },
                        dbServiceAccessOptions,
                    };
                    const findByIdTeacher = (await teacherDbService.findById({
                        _id: fakeTeacher.teacherData._id,
                        dbServiceAccessOptions,
                    }));
                    const findByIdTeacherCache = (await teacherDbService.findById({
                        _id: fakeTeacher.teacherData._id,
                        dbServiceAccessOptions,
                    }));
                    const findOneTeacher = (await teacherDbService.findOne(findParams));
                    const findTeachers = (await teacherDbService.find(findParams));
                    (0, chai_1.expect)(findByIdTeacher.tags).to.deep.equal(findByIdTeacherCache.tags);
                    (0, chai_1.expect)(findByIdTeacher.tags).to.deep.equal(findOneTeacher.tags);
                    (0, chai_1.expect)(findByIdTeacher).to.deep.equal(findTeachers[0]);
                    return findByIdTeacher;
                };
                context('as a non-admin user', () => {
                    context('viewing self', () => {
                        it('should find the teacher and return an unrestricted view', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            const findByIdTeacher = await getTeacher();
                            (0, chai_1.expect)(findByIdTeacher).to.have.property('licenseUrl');
                        });
                    });
                    context('viewing other', () => {
                        it('should find the teacher and return an restricted view', async () => {
                            const findByIdTeacher = await getTeacher();
                            (0, chai_1.expect)(findByIdTeacher).to.not.have.property('licenseUrl');
                        });
                    });
                });
                context('as an admin', () => {
                    it('should find the teacher and return an unrestricted view', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        const findByIdTeacher = await getTeacher();
                        (0, chai_1.expect)(findByIdTeacher).to.have.property('licenseUrl');
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    const findByIdTeacher = await teacherDbService.findById({
                        _id: fakeTeacher.teacherData._id,
                        dbServiceAccessOptions,
                    });
                }
                catch (err) {
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
    describe('insert', () => {
        it('should throw an error', async () => {
            dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
            const { ...modelToInsert } = fakeTeacher.teacherData;
            try {
                await teacherDbService.insert({
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
        const updateTeacher = async () => {
            const overrideDbServiceAccessOptions = appointmentDbService.getOverrideDbServiceAccessOptions();
            const updatedTeacher = await teacherDbService.findOneAndUpdate({
                searchQuery: { _id: fakeTeacher.teacherData._id },
                updateQuery: { studentCount: 5 },
                dbServiceAccessOptions,
            });
            const findAppointment = await appointmentDbService.findOne({
                searchQuery: {
                    hostedById: fakeTeacher._id,
                },
                dbServiceAccessOptions: overrideDbServiceAccessOptions,
            });
            const findPackageTransaction = await packageTransactionDbService.findOne({
                searchQuery: {
                    hostedById: fakeTeacher._id,
                },
                dbServiceAccessOptions,
            });
            (0, chai_1.expect)(findPackageTransaction.hostedByData.teacherData.studentCount).to.equal(5);
            (0, chai_1.expect)(updatedTeacher).to.not.deep.equal(fakeTeacher);
            (0, chai_1.expect)(updatedTeacher.studentCount).to.equal(5);
            (0, chai_1.expect)(findAppointment.packageTransactionData.hostedByData.teacherData.studentCount).to.equal(5);
            return updatedTeacher;
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should return the original teacher if update field does not exist', async () => {
                    const updatedTeacher = await teacherDbService.findOneAndUpdate({
                        searchQuery: {
                            _id: fakeTeacher.teacherData._id,
                        },
                        updateQuery: {
                            nonExistentField: 'some non-existent field',
                        },
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(updatedTeacher).to.deep.equal(fakeTeacher.teacherData);
                    return updatedTeacher;
                });
                it('should return null if the teacher to update does not exist', async () => {
                    const updatedTeacher = await teacherDbService.findOneAndUpdate({
                        searchQuery: {
                            _id: fakeTeacher.teacherData.packages[0]._id,
                        },
                        updateQuery: { studentCount: 5 },
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(updatedTeacher).to.equal(null);
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('updating self', () => {
                        it('should update the teacher', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            const updatedTeacher = await updateTeacher();
                            (0, chai_1.expect)(updatedTeacher).to.have.property('licenseUrl');
                        });
                    });
                    context('updating other', async () => {
                        it('should update the teacher', async () => {
                            const updatedTeacher = await updateTeacher();
                            (0, chai_1.expect)(updatedTeacher).to.not.have.property('licenseUrl');
                        });
                    });
                });
                context('as an admin', async () => {
                    it('should update the teacher', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        const updatedTeacher = await updateTeacher();
                        (0, chai_1.expect)(updatedTeacher).to.have.property('licenseUrl');
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    await updateTeacher();
                }
                catch (err) {
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
    describe('delete', () => {
        const deleteTeacher = async () => {
            const foundUserBefore = await userDbService.findById({
                _id: fakeTeacher._id,
                dbServiceAccessOptions,
            });
            const deletedTeacher = await teacherDbService.findByIdAndDelete({
                _id: fakeTeacher.teacherData._id,
                dbServiceAccessOptions,
            });
            const foundTeacher = await teacherDbService.findById({
                _id: fakeTeacher.teacherData._id,
                dbServiceAccessOptions,
            });
            const foundUser = await userDbService.findById({
                _id: fakeTeacher._id,
                dbServiceAccessOptions,
            });
            (0, chai_1.expect)(deletedTeacher).to.not.deep.equal(foundTeacher);
            (0, chai_1.expect)(foundTeacher).to.be.equal(null);
            (0, chai_1.expect)(foundUser).to.not.equal(null);
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should return null if the teacher to delete does not exist', async () => {
                    const deletedTeacher = await teacherDbService.findByIdAndDelete({
                        _id: fakeTeacher.teacherData.packages[0]._id,
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(deletedTeacher).to.equal(null);
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('deleting self', () => {
                        it('should update the package', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await deleteTeacher();
                        });
                    });
                    context('deleting other', async () => {
                        it('should update the package', async () => {
                            await deleteTeacher();
                        });
                    });
                });
                context('as an admin', async () => {
                    it('should update the package', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await deleteTeacher();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    await deleteTeacher();
                }
                catch (err) {
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
});
