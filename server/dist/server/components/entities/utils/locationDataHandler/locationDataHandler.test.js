"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const user_1 = require("../../../dataAccess/services/user");
const fakeDbUserFactory_1 = require("../../../dataAccess/testFixtures/fakeDbUserFactory");
let locationDataHandler;
let userDbService;
let fakeDbUserFactory;
let fakeUser;
let fakeTeacher;
let overrideFakeUser;
let overrideFakeTeacher;
let dbServiceAccessOptions;
let locationData;
before(async () => {
    locationDataHandler = _1.makeLocationDataHandler;
    userDbService = await user_1.makeUserDbService;
    fakeDbUserFactory = await fakeDbUserFactory_1.makeFakeDbUserFactory;
});
beforeEach(async () => {
    dbServiceAccessOptions = userDbService.getOverrideDbServiceAccessOptions();
    fakeUser = await fakeDbUserFactory.createFakeDbUser();
    overrideFakeUser = await userDbService.findById({
        _id: fakeUser._id,
        dbServiceAccessOptions,
    });
    fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
    overrideFakeTeacher = await userDbService.findById({
        _id: fakeTeacher._id,
        dbServiceAccessOptions,
    });
    locationData = locationDataHandler.getLocationData({
        hostedByData: overrideFakeTeacher,
        reservedByData: overrideFakeUser,
    });
});
describe('locationDataHandler', () => {
    describe('getLocationData', () => {
        context('valid inputs', () => {
            context('same contact method', async () => {
                it('should return locationData with a matched contact method', () => {
                    (0, chai_1.expect)(locationData).to.have.property('hostedByContactMethod');
                    (0, chai_1.expect)(locationData).to.have.property('reservedByContactMethod');
                    (0, chai_1.expect)(locationData.name).to.not.equal('alternative');
                });
            });
            context('different contact method', () => {
                it('should return locationData with an alternative contact method', () => {
                    overrideFakeTeacher.contactMethods[0].name = 'Skype';
                    locationData = locationDataHandler.getLocationData({
                        hostedByData: overrideFakeTeacher,
                        reservedByData: overrideFakeUser,
                    });
                    (0, chai_1.expect)(locationData.name).to.equal('alternative');
                });
            });
        });
        context('invalid inputs', () => {
            it('should throw an error', () => {
                try {
                    locationDataHandler.getLocationData({
                        hostedByData: fakeTeacher,
                        reservedByData: fakeUser,
                    });
                }
                catch (err) {
                    (0, chai_1.expect)(err).to.be.an('error');
                }
            });
        });
    });
});
