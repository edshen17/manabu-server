"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAppointmentFactory_1 = require("../../testFixtures/fakeDbAppointmentFactory");
const fakeDbPackageTransactionFactory_1 = require("../../testFixtures/fakeDbPackageTransactionFactory");
const fakeDbUserFactory_1 = require("../../testFixtures/fakeDbUserFactory");
const appointment_1 = require("../appointment");
const packageTransaction_1 = require("../packageTransaction");
let userDbService;
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
    userDbService = await _1.makeUserDbService;
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
describe('userDbService', () => {
    describe('findById, findOne, find', () => {
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if given an invalid id', async () => {
                    try {
                        const findByIdUser = await userDbService.findById({
                            _id: 'undefined',
                            dbServiceAccessOptions,
                        });
                    }
                    catch (err) {
                        (0, chai_1.expect)(err).to.be.an('error');
                    }
                });
                it('should return undefined if given a non-existent id', async () => {
                    const findByIdUser = await userDbService.findById({
                        _id: '60979db0bb31ed001589a1ea',
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(findByIdUser).to.equal(null);
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('viewing other', () => {
                        it('should return a restricted view of another user', async () => {
                            const findByIdUser = await userDbService.findById({
                                _id: fakeUser._id,
                                dbServiceAccessOptions,
                            });
                            const findOneUser = await userDbService.findOne({
                                searchQuery: {
                                    _id: fakeUser._id,
                                },
                                dbServiceAccessOptions,
                            });
                            const findUsers = await userDbService.find({
                                searchQuery: {
                                    _id: fakeUser._id,
                                },
                                dbServiceAccessOptions,
                            });
                            (0, chai_1.expect)(findByIdUser).to.deep.equal(findOneUser);
                            (0, chai_1.expect)(findByIdUser).to.deep.equal(findUsers[0]);
                            (0, chai_1.expect)(findByIdUser).to.not.have.property('email');
                            (0, chai_1.expect)(findByIdUser).to.not.have.property('password');
                            (0, chai_1.expect)(findByIdUser).to.not.have.property('verificationToken');
                            (0, chai_1.expect)(findByIdUser).to.not.have.property('settings');
                            (0, chai_1.expect)(findByIdUser).to.not.have.property('contactMethods');
                        });
                        it('should return a joined restricted view of another teacher', async () => {
                            const findByIdTeacher = await userDbService.findById({
                                _id: fakeTeacher._id,
                                dbServiceAccessOptions,
                            });
                            (0, chai_1.expect)(findByIdTeacher).to.have.property('teacherData');
                            (0, chai_1.expect)(findByIdTeacher.teacherData).to.have.property('packages');
                            (0, chai_1.expect)(findByIdTeacher.teacherData).to.not.have.property('licenseUrl');
                            (0, chai_1.expect)(findByIdTeacher.teacherData.applicationStatus).to.equal('approved');
                            (0, chai_1.expect)(findByIdTeacher).to.not.have.property('email');
                            (0, chai_1.expect)(findByIdTeacher).to.not.have.property('password');
                            (0, chai_1.expect)(findByIdTeacher).to.not.have.property('verificationToken');
                            (0, chai_1.expect)(findByIdTeacher).to.not.have.property('settings');
                            (0, chai_1.expect)(findByIdTeacher).to.not.have.property('contactMethods');
                            (0, chai_1.expect)(fakeTeacher).to.deep.equal(findByIdTeacher);
                        });
                    });
                    context('viewing self', () => {
                        it('should return a less restricted view of a user', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            const findByIdUser = await userDbService.findById({
                                _id: fakeUser._id,
                                dbServiceAccessOptions,
                            });
                            (0, chai_1.expect)(findByIdUser).to.not.have.property('password');
                            (0, chai_1.expect)(findByIdUser).to.not.have.property('verificationToken');
                            (0, chai_1.expect)(findByIdUser).to.have.property('email');
                            (0, chai_1.expect)(findByIdUser).to.have.property('settings');
                            (0, chai_1.expect)(findByIdUser).to.have.property('contactMethods');
                        });
                        it('should return a less restricted view of a teacher', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            const findByIdTeacher = await userDbService.findById({
                                _id: fakeTeacher._id,
                                dbServiceAccessOptions,
                            });
                            (0, chai_1.expect)(findByIdTeacher.teacherData).to.have.property('licenseUrl');
                        });
                    });
                    context('overriding default select view', () => {
                        it('should return an user with the password field', async () => {
                            dbServiceAccessOptions.isOverrideView = true;
                            const findByIdUser = await userDbService.findById({
                                _id: fakeUser._id,
                                dbServiceAccessOptions,
                            });
                            (0, chai_1.expect)(findByIdUser).to.have.property('password');
                        });
                    });
                });
                context('as an admin', () => {
                    it('should return additional restricted data', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        const findByIdTeacher = await userDbService.findById({
                            _id: fakeTeacher._id,
                            dbServiceAccessOptions,
                        });
                        (0, chai_1.expect)(findByIdTeacher.teacherData).to.have.property('licenseUrl');
                        (0, chai_1.expect)(findByIdTeacher).to.have.property('email');
                        (0, chai_1.expect)(findByIdTeacher).to.have.property('settings');
                        (0, chai_1.expect)(findByIdTeacher).to.have.property('contactMethods');
                        (0, chai_1.expect)(findByIdTeacher).to.not.have.property('password');
                        (0, chai_1.expect)(findByIdTeacher).to.not.have.property('verificationToken');
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    const findByIdUser = await userDbService.findById({
                        _id: fakeUser._id,
                        dbServiceAccessOptions,
                    });
                }
                catch (err) {
                    (0, chai_1.expect)(err).to.be.an('error');
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
    describe('insert', () => {
        context('db access permitted', () => {
            context('valid inputs', () => {
                it('should insert a new user into the db', async () => {
                    //TODO: create a new user for clarity
                    const searchUser = await userDbService.findById({
                        _id: fakeUser._id,
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(fakeUser).to.deep.equal(searchUser);
                });
            });
            context('invalid inputs', () => {
                it('should throw an error when creating a duplicate user', async () => {
                    try {
                        const dupeEntityData = {
                            name: 'some name',
                            email: 'duplicateEmail@email.com',
                        };
                        const fakeUser = await fakeDbUserFactory.createFakeDbData(dupeEntityData);
                        const dupeUser = await fakeDbUserFactory.createFakeDbData(dupeEntityData);
                    }
                    catch (err) {
                        (0, chai_1.expect)(err).be.an('error');
                    }
                });
                it('should throw an error when required fields are not given', async () => {
                    try {
                        const fakeUser = await userDbService.insert({
                            modelToInsert: {},
                            dbServiceAccessOptions,
                        });
                    }
                    catch (err) {
                        (0, chai_1.expect)(err).be.an('error');
                    }
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                try {
                    dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                    const entityData = {
                        name: 'test',
                        email: 'someEmail@email.com',
                    };
                    const fakeUser = await fakeDbUserFactory.createFakeDbData(entityData);
                }
                catch (err) {
                    (0, chai_1.expect)(err).to.be.an('error');
                }
            });
        });
    });
    describe('update', () => {
        context('db access permitted', () => {
            context('valid inputs', () => {
                context('as non-admin user', () => {
                    context('updating self', () => {
                        it('should update db document and return a less restricted view', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            const updatedTeacher = await userDbService.findOneAndUpdate({
                                searchQuery: { _id: fakeTeacher._id },
                                updateQuery: {
                                    name: 'updated name',
                                    $pull: {
                                        'teacherData.packages': {
                                            _id: fakeTeacher.teacherData.packages[0]._id,
                                        },
                                    },
                                },
                                dbServiceAccessOptions,
                            });
                            (0, chai_1.expect)(updatedTeacher.name).to.equal('updated name');
                            (0, chai_1.expect)(updatedTeacher).to.have.property('email');
                            (0, chai_1.expect)(updatedTeacher).to.have.property('settings');
                            (0, chai_1.expect)(updatedTeacher).to.have.property('contactMethods');
                            (0, chai_1.expect)(updatedTeacher).to.not.have.property('password');
                            (0, chai_1.expect)(updatedTeacher).to.not.have.property('verficiationToken');
                        });
                        it('should update db dependencies with restricted views', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            (0, chai_1.expect)(fakePackageTransaction.hostedByData).to.deep.equal(fakeTeacher);
                            const updatedTeacher = await userDbService.findOneAndUpdate({
                                searchQuery: { _id: fakeTeacher._id, 'contactMethods.methodName': 'LINE' },
                                updateQuery: {
                                    name: 'updated name',
                                    $set: {
                                        'contactMethods.$.methodName': 'Skype',
                                    },
                                },
                                dbServiceAccessOptions,
                            });
                            (0, chai_1.expect)(updatedTeacher.name).to.equal('updated name');
                            const updatedPackageTransaction = await packageTransactionDbService.findOne({
                                searchQuery: { hostedById: fakeTeacher._id },
                                dbServiceAccessOptions,
                            });
                            const packageTransactionHostedByData = updatedPackageTransaction.hostedByData;
                            (0, chai_1.expect)(packageTransactionHostedByData.name).to.equal(updatedTeacher.name);
                            (0, chai_1.expect)(packageTransactionHostedByData).to.not.have.property('email');
                            (0, chai_1.expect)(packageTransactionHostedByData).to.not.have.property('contactMethods');
                            (0, chai_1.expect)(packageTransactionHostedByData.teacherData).to.not.have.property('licenseUrl');
                        });
                    });
                    context('updating others', () => {
                        it('should update db document and return a restricted view', async () => {
                            const updatedTeacher = await userDbService.findOneAndUpdate({
                                searchQuery: { _id: fakeTeacher._id },
                                updateQuery: { profileBio: 'updated bio' },
                                dbServiceAccessOptions,
                            });
                            (0, chai_1.expect)(updatedTeacher.profileBio).to.equal('updated bio');
                            (0, chai_1.expect)(updatedTeacher).to.not.have.property('email');
                            (0, chai_1.expect)(updatedTeacher).to.not.have.property('settings');
                            (0, chai_1.expect)(updatedTeacher).to.not.have.property('commTools');
                            (0, chai_1.expect)(updatedTeacher).to.not.have.property('password');
                            (0, chai_1.expect)(updatedTeacher).to.not.have.property('verficiationToken');
                        });
                    });
                });
                context('as admin', () => {
                    it('should update db document and return a less restricted view', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        const updatedTeacher = await userDbService.findOneAndUpdate({
                            searchQuery: { _id: fakeTeacher._id },
                            updateQuery: { profileImageUrl: 'updated image' },
                            dbServiceAccessOptions,
                        });
                        (0, chai_1.expect)(updatedTeacher.teacherData).to.have.property('licenseUrl');
                        (0, chai_1.expect)(updatedTeacher.profileImageUrl).to.equal('updated image');
                        (0, chai_1.expect)(updatedTeacher).to.have.property('email');
                        (0, chai_1.expect)(updatedTeacher).to.have.property('settings');
                        (0, chai_1.expect)(updatedTeacher).to.have.property('contactMethods');
                        (0, chai_1.expect)(updatedTeacher).to.not.have.property('password');
                        (0, chai_1.expect)(updatedTeacher).to.not.have.property('verficiationToken');
                    });
                });
            });
            context('invalid inputs', () => {
                it('should return undefined if the user to update does not exist', async () => {
                    const updatedTeacher = await userDbService.findOneAndUpdate({
                        searchQuery: { email: fakeTeacher._id },
                        updateQuery: { profileImageUrl: 'updated image' },
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(updatedTeacher).to.equal(null);
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                try {
                    dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                    const updatedTeacher = await userDbService.findOneAndUpdate({
                        searchQuery: { _id: fakeTeacher._id },
                        updateQuery: { profileImageUrl: 'updated image' },
                        dbServiceAccessOptions,
                    });
                }
                catch (err) {
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
    describe('countDocuments', () => {
        it('should count the documents', async () => {
            const userCount = await userDbService.countDocuments({
                searchQuery: { _id: fakeTeacher._id },
                dbServiceAccessOptions,
            });
            (0, chai_1.expect)(userCount).to.equal(1);
        });
    });
});
