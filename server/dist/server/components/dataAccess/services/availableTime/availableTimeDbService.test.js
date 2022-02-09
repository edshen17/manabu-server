"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const fakeDbAvailableTimeFactory_1 = require("../../testFixtures/fakeDbAvailableTimeFactory");
let availableTimeDbService;
let fakeDbAvailableTimeFactory;
let dbServiceAccessOptions;
let fakeAvailableTime;
before(async () => {
    availableTimeDbService = await _1.makeAvailableTimeDbService;
    fakeDbAvailableTimeFactory = await fakeDbAvailableTimeFactory_1.makeFakeDbAvailableTimeFactory;
});
beforeEach(async () => {
    dbServiceAccessOptions = availableTimeDbService.getBaseDbServiceAccessOptions();
    fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
});
describe('availableTimeDbService', () => {
    describe('findById, findOne, find', () => {
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if given an invalid id', async () => {
                    try {
                        await availableTimeDbService.findById({
                            _id: undefined,
                            dbServiceAccessOptions,
                        });
                    }
                    catch (err) {
                        (0, chai_1.expect)(err).be.an('error');
                    }
                });
                it('should return null if given an non-existent id', async () => {
                    const findByIdAvailableTime = await availableTimeDbService.findById({
                        _id: '60979db0bb31ed001589a1ea',
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(findByIdAvailableTime).to.equal(null);
                });
            });
            context('valid inputs', () => {
                const getAvailableTime = async () => {
                    const findParams = {
                        searchQuery: {
                            hostedById: fakeAvailableTime.hostedById,
                        },
                        dbServiceAccessOptions,
                    };
                    const findByIdAvailableTime = await availableTimeDbService.findById({
                        _id: fakeAvailableTime._id,
                        dbServiceAccessOptions,
                    });
                    const findOneAvailableTime = await availableTimeDbService.findOne(findParams);
                    const findAvailableTimes = await availableTimeDbService.find(findParams);
                    (0, chai_1.expect)(findByIdAvailableTime).to.deep.equal(findOneAvailableTime);
                    (0, chai_1.expect)(findByIdAvailableTime).to.deep.equal(findAvailableTimes[0]);
                };
                context('as a non-admin user', () => {
                    context('viewing self', () => {
                        it('should find the AvailableTime and return an unrestricted view on some data', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await getAvailableTime();
                        });
                    });
                    context('viewing other', () => {
                        it('should find the AvailableTime and return an unrestricted view on some data', async () => {
                            await getAvailableTime();
                        });
                    });
                });
                context('as an admin', () => {
                    it('should find the AvailableTime and return an restricted view on some data', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await getAvailableTime();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                let err;
                try {
                    err = await availableTimeDbService.findById({
                        _id: fakeAvailableTime._id,
                        dbServiceAccessOptions,
                    });
                }
                catch (err) {
                    return;
                }
                (0, chai_1.expect)(err).to.be.an('error');
            });
        });
    });
    describe('insert', () => {
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if required fields are not given', async () => {
                    try {
                        fakeAvailableTime = await availableTimeDbService.insert({
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
                it('should insert an AvailableTime', async () => {
                    const findByIdAvailableTime = await availableTimeDbService.findById({
                        _id: fakeAvailableTime._id,
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(findByIdAvailableTime).to.not.equal(null);
                    (0, chai_1.expect)(findByIdAvailableTime).to.deep.equal(fakeAvailableTime);
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                const { _id, ...modelToInsert } = fakeAvailableTime;
                try {
                    fakeAvailableTime = await availableTimeDbService.insert({
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
        const updateAvailableTime = async () => {
            const updatedAvailableTime = await availableTimeDbService.findOneAndUpdate({
                searchQuery: { _id: fakeAvailableTime._id },
                updateQuery: { startDate: new Date() },
                dbServiceAccessOptions,
            });
            (0, chai_1.expect)(updatedAvailableTime).to.not.deep.equal(fakeAvailableTime);
            (0, chai_1.expect)(updatedAvailableTime.startDate).to.not.equal(fakeAvailableTime.startDate);
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should return null if the availableTime to update does not exist', async () => {
                    const updatedAvailableTime = await availableTimeDbService.findOneAndUpdate({
                        searchQuery: {
                            _id: fakeAvailableTime.hostedById,
                        },
                        updateQuery: { status: 'cancelled' },
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(updatedAvailableTime).to.equal(null);
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('updating self', () => {
                        it('should update the availableTime', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await updateAvailableTime();
                        });
                    });
                    context('updating other', async () => {
                        it('should update the availableTime', async () => {
                            await updateAvailableTime();
                        });
                    });
                });
                context('as an admin', async () => {
                    it('should update the availableTime', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await updateAvailableTime();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    await updateAvailableTime();
                }
                catch (err) {
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
    describe('delete', () => {
        const deleteAvailableTime = async () => {
            const deletedAvailableTime = await availableTimeDbService.findByIdAndDelete({
                _id: fakeAvailableTime._id,
                dbServiceAccessOptions,
            });
            const foundAvailableTime = await availableTimeDbService.findById({
                _id: fakeAvailableTime._id,
                dbServiceAccessOptions,
            });
            (0, chai_1.expect)(foundAvailableTime).to.not.deep.equal(deletedAvailableTime);
            (0, chai_1.expect)(foundAvailableTime).to.be.equal(null);
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should return null if the availableTime to delete does not exist', async () => {
                    const deletedAvailableTime = await availableTimeDbService.findByIdAndDelete({
                        _id: fakeAvailableTime.hostedById,
                        dbServiceAccessOptions,
                    });
                    (0, chai_1.expect)(deletedAvailableTime).to.equal(null);
                });
            });
            context('valid inputs', () => {
                context('as a non-admin user', () => {
                    context('deleting self', () => {
                        it('should update the availableTime', async () => {
                            dbServiceAccessOptions.isSelf = true;
                            await deleteAvailableTime();
                        });
                    });
                    context('deleting other', async () => {
                        it('should update the availableTime', async () => {
                            await deleteAvailableTime();
                        });
                    });
                });
                context('as an admin', async () => {
                    it('should update the availableTime', async () => {
                        dbServiceAccessOptions.currentAPIUserRole = 'admin';
                        await deleteAvailableTime();
                    });
                });
            });
        });
        context('db access denied', () => {
            it('should throw an error', async () => {
                dbServiceAccessOptions.isCurrentAPIUserPermitted = false;
                try {
                    await deleteAvailableTime();
                }
                catch (err) {
                    (0, chai_1.expect)(err.message).to.equal('Access denied.');
                }
            });
        });
    });
});
